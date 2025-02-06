#! /bin/bash

ROLE_NAME="brendan-notebook-lambda-generator"
BUCKET_NAME="brendan-notebook-bucket"

aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document file://dashboard/backend/src/lambda_generator/trust_policy.json

aws iam put-role-policy \
    --role-name $ROLE_NAME \
    --policy-name notebook-lambda-policy \
    --policy-document file://dashboard/backend/src/lambda_generator/role_policy.json

aws configure

aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region us-west-1 \
    --create-bucket-configuration LocationConstraint=us-west-1

