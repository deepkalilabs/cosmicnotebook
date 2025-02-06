from cosmic.connectors import PostHogService
from datetime import datetime, timezone, timedelta
import io
import base64
import csv
import resend


def initialize_posthog(api_key: str, project_id: str):
    credentials = {
        "api_key": api_key,
        "base_url": "https://us.posthog.com",
        "project_id": project_id,
    }
    posthog_service = PostHogService(credentials)
    return posthog_service

def get_posthog_results(start_date, posthog_service):
    res = posthog_service.fetch_posthog_user_logins(start_date)
    column_types = res["data"]["types"]
    results = res["data"]["results"]

    return results

def get_posthog_churn_data(events):
    # Get uniuqe user_ids
    all_user_ids = set()
    churn_data = []

    for row in events:
        user_id = row[1]  # distinct id
        # print("user_id", user_id)
        date = datetime.fromisoformat(row[0].replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        days_ago = (now - date).days

        if user_id not in all_user_ids:
            churn_data.append(
                {"user_id": user_id, "days_logged_in_ago": days_ago}
            )
            all_user_ids.add(user_id)
    print(churn_data)
    return churn_data

def send_email(churn_data):
    csv_buffer = io.StringIO()
    writer = csv.DictWriter(csv_buffer, fieldnames=churn_data[0].keys())
    writer.writeheader()  # Write header
    writer.writerows(churn_data)
    date = datetime.now()
    formatted_date = date.strftime("%b, %d, %Y")
    subject = f"Cosmic update {formatted_date}: Users last logged in"

    # Get the CSV content as string
    csv_content = csv_buffer.getvalue()
    csv_buffer.close()

    # Encode the CSV content to Base64 for email attachement
    encoded_csv = base64.b64encode(csv_content.encode("utf-8")).decode("utf-8")

    resend.api_key = "re_HsPtejpb_8Tx9Mx4tXE2Gz2Q3GuW7QiKm"

    # Sending email with the attachement
    r = resend.Emails.send(
        {
            "from": "shikhar@agentkali.ai",
            "to": ["shikharsakhuja@gmail.com", "charlesjavelona@gmail.com"],
            "subject": subject,
            "html": "<p>Hi team, please see our users last login date.</p>",
            "attachments": [
                {
                    "filename": f"provision-churn-trigger-{formatted_date}.csv",
                    "content": encoded_csv,
                    "content_type": "text/csv",
                }
            ],
        }
    )
    print("Sending email", r)

from pydantic import BaseModel


class EntrypointParams(BaseModel):
    api_key: str
    project_id: str


def entrypoint(params: EntrypointParams):
    posthog_service = initialize_posthog(params.api_key, params.project_id)
    date_three_months_ago = (datetime.today() - timedelta(days=90)).strftime(
        "%Y-%m-%d"
    )
    posthog_results = get_posthog_results(
        date_three_months_ago, posthog_service
    )
    churn_data = get_posthog_churn_data(posthog_results)
    send_email(churn_data)


entrypoint(
    EntrypointParams(
        **{
            "api_key": "phx_wpWyIsZhbd0HiTm2Yer54xVBUc4pqubwDYHyF8KDIuloQdP",
            "project_id": "24075",
        }
    )
)
