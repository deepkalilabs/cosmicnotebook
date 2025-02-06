# Steps

```
git@github.com:deepkalilabs/cosmicnotebook.git 
git submodule init
git submodule update
git checkout brendan-deploy


rename .env-brendan -> .env
rename .env.local-brendan -> .env.local


./pre-docker-setup.sh
docker compose up --build -d 
```

# create .env.local file using the .env file in the email.
# create new notebook from the dashboard
# use code snippet for posthog churn analytics in `sample-brendan-posthog.py`

# pip install cosmic-sdk resend within the notebook
# for cosmic.connectors to work, we need to pip install cosmic

# follow loom for more instructions: https://www.loom.com/share/ea5d6fc9fe5943a6a92d9e37f9f9679d?sid=34ce1e4d-08c6-4d0e-b73b-243c94cfcebe 
