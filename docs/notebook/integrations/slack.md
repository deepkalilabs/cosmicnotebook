# Slack Integration from a Notebook
This integration is used to send messages to a Slack channel from a notebook.
For this version, an app within your Slack workspace is required. If you don't have one, you can create one [here](https://api.slack.com/apps).

# 1. Create an app in Slack

1. Go to the [Slack API](https://api.slack.com/apps) page.
2. Click on the "Create New App" button.
3. Select "From a manifest" as the app type.
4. Select your workspace from the dropdown menu.
5. Copy and paste the manifest file in the "Manifest" section.
6. Click on the "Create App" button.

## Manifest file in JSON format

```json
{
    "display_information": {
        "name": "Cosmic"
    },
    "features": {
        "bot_user": {
            "display_name": "Cosmic",
            "always_online": false
        }
    },
    "oauth_config": {
        "redirect_urls": [
            "https://trycosmic.ai/api/integrations/2cc8ca74-0b89-4c9f-9a7e-461f53d98a21/slack"
        ],
        "scopes": {
            "bot": [
                "chat:write",
                "channels:read"
            ]
        }
    },
    "settings": {
        "org_deploy_enabled": true,
        "socket_mode_enabled": false,
        "token_rotation_enabled": false
    }
}
```

## Manifest file in YAML format

```yaml 
display_information:
  name: Cosmic
features:
  bot_user:
    display_name: Cosmic
    always_online: false
oauth_config:
  redirect_urls:
    - https://trycosmic.ai/api/integrations/2cc8ca74-0b89-4c9f-9a7e-461f53d98a21/slack
  scopes:
    bot:
      - chat:write
      - channels:read
settings:
  org_deploy_enabled: true
  socket_mode_enabled: false
  token_rotation_enabled: false
```

# 2. Install the app in your workspace

1. Once in the page. Under the settings page - click "Install App".
2. Select your workspace from the dropdown menu.
3. Click on the "Install" or "Reinstall" button.

# 3. Copy the bot user OAuth token

1. Once the app is installed, copy the "Bot User OAuth Token" token.
2. Paste it in the "Bot User OAuth Token" field in the Cosmic integration slack side page.

# 3. Select a channel or create one and copy the ID to the integration page

1. Go to the channel page in Slack.
2. Give the channel a name, e.g. "Test Cosmic".
3. Copy the channel ID by right clicking on the channel name, and selecting "View Channel Details". At the bottom of the page, you will see the channel ID. Click on the "Copy" button.
4. Paste it in the "Channel" field in the integration page.
5. Click on the "Save" button on the integration page for the changes to take effect.


# 4. Invite the bot to the channel

1. Go to the channel page in Slack.
2. On the text input field, type `/invite @ Cosmic`. 
3. Press enter.

# 5. Test the integration from the slack integration side page.

1. A slack card should be added to the integration page.
2. Click on the "Test" button.
3. A message should be sent to the channel.
