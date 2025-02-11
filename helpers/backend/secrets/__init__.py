from .aws import AWSSecretsProvider

# To use a different provider, you can set the provider variable to the new provider. 
# For example, to use the AWS Secrets Manager provider, you can do the following:
#
# provider = DooplerSecretsProvider(region_name='us-west-2')
#
provider = AWSSecretsProvider(region_name='us-west-2')

secrets_manager = provider

#To import the secrets_manager variable, you can do the following:
#
# from secrets import secrets_manager
#
__all__ = ['secrets_manager']