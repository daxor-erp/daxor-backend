# Daxor Backend - AWS Deployment Guide

This guide explains how to deploy the Daxor backend to AWS EC2 at **api.daxor.in**.

## Prerequisites

1. **AWS EC2 Instance** (Ubuntu 20.04 or later)
2. **GitHub Repository** with SSH access configured
3. **Domain**: api.daxor.in configured
4. **GitHub Secrets** configured in repository settings

## Required GitHub Secrets

Configure these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

- `DAXOR_EC2_HOST` - EC2 instance public IP or api.daxor.in
- `DAXOR_EC2_USERNAME` - SSH username (usually `ubuntu`)
- `DAXOR_EC2_SSH_KEY` - Private SSH key for EC2 access

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│                  (daxor-backend)                        │
└────────────────────────┬───────────────────────────────┘
                         │
                         │ Push to main
                         │
                         ▼
             ┌────────────────────────┐
             │   GitHub Actions       │
             │   (deploy-prod.yml)    │
             └────────────┬───────────┘
                         │
                         │ SSH Deploy
                         │
                         ▼
             ┌────────────────────────┐
             │   EC2 Instance         │
             │   ~/daxor-backend      │
             │   PM2: api.daxor.in    │
             │   Port: 8080           │
             │   URL: api.daxor.in    │
             └────────────────────────┘
```

## Deployment Workflow

1. Push code to `main` branch
2. GitHub Actions triggers `deploy-prod.yml`
3. Workflow connects to EC2 via SSH
4. Pulls latest code from `main` branch
5. Installs dependencies with Bun
6. Runs codegen and builds application
7. Restarts PM2 process `api.daxor.in`
8. Performs health check at https://api.daxor.in/graphql

## EC2 Instance Setup

### 1. Launch EC2 Instance
- **AMI**: Ubuntu 22.04 LTS
- **Instance Type**: t3.medium or larger (recommended)
- **Storage**: 20GB+ EBS volume
- **Security Group**: 
  - SSH (22) from your IP
  - HTTP (80) from anywhere
  - HTTPS (443) from anywhere
  - Custom TCP (8080) from anywhere (or restrict to your needs)

### 2. Initial Server Configuration

SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@api.daxor.in
```

Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

Install PM2 globally:
```bash
sudo npm install -g pm2
```

Setup PM2 to start on boot:
```bash
pm2 startup
# Follow the command it outputs
```

### 3. Configure SSH Access for GitHub

Generate SSH key on EC2:
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
```

Add the public key to your GitHub repository:
- Go to GitHub → Repository → Settings → Deploy keys
- Add new deploy key with the public key content

### 4. Clone Repository

```bash
cd ~
git clone git@github.com:healthflex-in/daxor-backend.git
cd daxor-backend
```

### 5. Configure Environment Variables

Create production environment file:
```bash
cd ~/daxor-backend/apps/api
cp .env.example .env.production
nano .env.production
```

Update the following critical values:
- `NODE_ENV=production`
- `PORT=8080`
- `MONGODB_URI` - Your production MongoDB connection string
- `DB_NAME` - Production database name
- `JWT_SECRET` - Strong secret key
- `EMAIL_*` - Email configuration
- `CORS_ORIGINS=https://daxor.in`

### 6. Initial Manual Deployment

```bash
cd ~/daxor-backend

# Install dependencies
bun install

# Run codegen
cd apps/api
bun run codegen
cd ../..

# Build application
bun run build:prod

# Start with PM2
pm2 start ecosystem.config.js --only "api.daxor.in"

# Save PM2 configuration
pm2 save
```

### 7. Setup Nginx

Install Nginx:
```bash
sudo apt install -y nginx
```

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/daxor-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.daxor.in;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /graphql {
        proxy_pass http://localhost:8080/graphql;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/daxor-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.daxor.in
```

## PM2 Management Commands

### View running processes
```bash
pm2 list
```

### View logs
```bash
pm2 logs api.daxor.in
```

### Restart application
```bash
pm2 restart api.daxor.in
```

### Stop application
```bash
pm2 stop api.daxor.in
```

### Monitor resources
```bash
pm2 monit
```

## Health Checks

### GraphQL Health Check (Local)
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

### GraphQL Health Check (Production)
```bash
curl -X POST https://api.daxor.in/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

## Troubleshooting

### Deployment fails
1. Check GitHub Actions logs
2. Verify SSH key is correct
3. Ensure EC2 security group allows SSH

### Application won't start
1. Check PM2 logs: `pm2 logs api.daxor.in`
2. Verify environment variables in `.env.production`
3. Check MongoDB connection
4. Ensure port 8080 is not in use

### Database connection issues
1. Verify MongoDB URI in `.env.production`
2. Check MongoDB Atlas IP whitelist (add EC2 IP)
3. Test connection manually

### Nginx issues
1. Check Nginx configuration: `sudo nginx -t`
2. View error logs: `sudo tail -f /var/log/nginx/error.log`
3. Restart Nginx: `sudo systemctl restart nginx`

## Rollback Procedure

If deployment fails, rollback to previous version:

```bash
cd ~/daxor-backend
git log --oneline -10  # Find previous commit
git reset --hard <commit-hash>
bun install
cd apps/api && bun run codegen && cd ../..
bun run build:prod
pm2 restart api.daxor.in
```

## Security Best Practices

1. **Never commit sensitive data** - Use environment variables
2. **Rotate JWT secrets** regularly
3. **Keep dependencies updated** - Run `bun update` regularly
4. **Monitor logs** for suspicious activity
5. **Use HTTPS** in production
6. **Restrict EC2 security groups** to necessary IPs
7. **Enable MongoDB authentication** and use strong passwords
8. **Regular backups** of database and configuration

## Monitoring & Logs

### Application Logs
```bash
pm2 logs api.daxor.in --lines 100
```

### System Logs
```bash
sudo journalctl -u nginx -f
```

### Nginx Access Logs
```bash
sudo tail -f /var/log/nginx/access.log
```

### Nginx Error Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

## EC2 Instance Setup

### 1. Launch EC2 Instance
- **AMI**: Ubuntu 22.04 LTS
- **Instance Type**: t3.medium or larger (recommended)
- **Storage**: 20GB+ EBS volume
- **Security Group**: 
  - SSH (22) from your IP
  - HTTP (80) from anywhere
  - HTTPS (443) from anywhere
  - Custom TCP (8080) from anywhere (or restrict to your needs)

### 2. Initial Server Configuration

SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

Install PM2 globally:
```bash
sudo npm install -g pm2
```

Setup PM2 to start on boot:
```bash
pm2 startup
# Follow the command it outputs
```

### 3. Configure SSH Access for GitHub

Generate SSH key on EC2:
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
```

Add the public key to your GitHub repository:
- Go to GitHub → Repository → Settings → Deploy keys
- Add new deploy key with the public key content
- Enable "Allow write access" if needed

### 4. Clone Repository

```bash
cd ~
git clone git@github.com:healthflex-in/daxor-backend.git
cd daxor-backend
```

### 5. Configure Environment Variables

Create production environment file:
```bash
cd ~/daxor-backend/apps/api
cp .env.example .env.production
nano .env.production
```

Update the following critical values:
- `NODE_ENV=production`
- `PORT=8080`
- `MONGODB_URI` - Your production MongoDB connection string
- `DB_NAME` - Production database name
- `JWT_SECRET` - Strong secret key
- `EMAIL_*` - Email configuration
- `CORS_ORIGINS` - Your frontend domain

### 6. Initial Manual Deployment

```bash
cd ~/daxor-backend

# Install dependencies
bun install

# Run codegen
cd apps/api
bun run codegen
cd ../..

# Build application
bun run build:prod

# Start with PM2
pm2 start ecosystem.config.js --only "daxor-api-prod"

# Save PM2 configuration
pm2 save
```

### 7. Setup Nginx (Optional but Recommended)

Install Nginx:
```bash
sudo apt install -y nginx
```

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/daxor-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.daxor.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # GraphQL endpoint
    location /graphql {
        proxy_pass http://localhost:8080/graphql;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/daxor-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup SSL with Let's Encrypt (Optional)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.daxor.yourdomain.com
```

## PM2 Management Commands

### View running processes
```bash
pm2 list
```

### View logs
```bash
pm2 logs daxor-api-dev
pm2 logs daxor-api-prod
```

### Restart application
```bash
pm2 restart daxor-api-dev
pm2 restart daxor-api-prod
```

### Stop application
```bash
pm2 stop daxor-api-dev
pm2 stop daxor-api-prod
```

### Monitor resources
```bash
pm2 monit
```

## Environment Files

### Development (.env.development)
- Used for dev branch deployments
- Points to development database
- Debug mode enabled
- Less strict security

### Production (.env.production)
- Used for main branch deployments
- Points to production database
- Debug mode disabled
- Strict security settings
- Rate limiting enabled

## Monitoring & Logs

### Application Logs
```bash
pm2 logs daxor-api-prod --lines 100
```

### System Logs
```bash
sudo journalctl -u nginx -f
```

### Nginx Access Logs
```bash
sudo tail -f /var/log/nginx/access.log
```

### Nginx Error Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

## Health Checks

### GraphQL Health Check
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

### Via Domain (if Nginx configured)
```bash
curl -X POST https://api.daxor.yourdomain.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

## Troubleshooting

### Deployment fails
1. Check GitHub Actions logs
2. Verify SSH key is correct
3. Ensure EC2 security group allows SSH

### Application won't start
1. Check PM2 logs: `pm2 logs daxor-api-prod`
2. Verify environment variables in `.env.production`
3. Check MongoDB connection
4. Ensure port 8080 is not in use

### Database connection issues
1. Verify MongoDB URI in `.env.production`
2. Check MongoDB Atlas IP whitelist (add EC2 IP)
3. Test connection manually

### Nginx issues
1. Check Nginx configuration: `sudo nginx -t`
2. View error logs: `sudo tail -f /var/log/nginx/error.log`
3. Restart Nginx: `sudo systemctl restart nginx`

## Rollback Procedure

If deployment fails, rollback to previous version:

```bash
cd ~/daxor-backend
git log --oneline -10  # Find previous commit
git reset --hard <commit-hash>
bun install
cd apps/api && bun run codegen && cd ../..
bun run build:prod
pm2 restart daxor-api-prod
```

## Security Best Practices

1. **Never commit sensitive data** - Use environment variables
2. **Rotate JWT secrets** regularly
3. **Keep dependencies updated** - Run `bun update` regularly
4. **Monitor logs** for suspicious activity
5. **Use HTTPS** in production
6. **Restrict EC2 security groups** to necessary IPs
7. **Enable MongoDB authentication** and use strong passwords
8. **Regular backups** of database and configuration

## Scaling Considerations

### Horizontal Scaling
- Use AWS Application Load Balancer
- Deploy multiple EC2 instances
- Configure PM2 cluster mode

### Vertical Scaling
- Upgrade EC2 instance type
- Increase EBS volume size
- Optimize MongoDB queries

## Cost Optimization

1. Use **Reserved Instances** for production
2. Enable **Auto Scaling** based on load
3. Use **CloudWatch** for monitoring
4. Implement **caching** (Redis) for frequently accessed data
5. Optimize **database queries** and indexes

## Support & Maintenance

- **Regular updates**: Keep dependencies and system packages updated
- **Monitoring**: Set up CloudWatch alarms for critical metrics
- **Backups**: Automated daily backups of MongoDB
- **Documentation**: Keep this guide updated with any changes

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
