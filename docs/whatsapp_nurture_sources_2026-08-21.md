# WhatsApp nurture integration — source notes

The optional WhatsApp follow-up uses the official WhatsApp Business Cloud API template-message pattern. Meta documentation confirms that approved template messages are sent through the Cloud API and that templates are WhatsApp Business Account assets:

- Meta template messages: https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/template-messages/
- Meta template fundamentals: https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview
- Meta Cloud API getting started: https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started

Implementation constraint: WhatsApp follow-up is guarded by environment variables for the Cloud API access token, phone-number ID, and approved template names. It remains disabled until those values exist; email acknowledgement and Telegram internal notification remain independent channels.
