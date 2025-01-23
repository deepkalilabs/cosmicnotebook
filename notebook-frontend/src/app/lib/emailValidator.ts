const PERSONAL_EMAIL_DOMAINS = [
    'gmail.com', 
    'yahoo.com', 
    'hotmail.com', 
    'outlook.com', 
    'aol.com', 
    'icloud.com', 
    'zoho.com', 
    'fastmail.com', 
    'protonmail.com', 
    'tutanota.com', 
    'hey.com', 
    'tutanota.com', 
    'yandex.com', 
    'mail.com', 
    'me.com',
    'mac.com',
    'comcast.net',
    'verizon.net',
    'bellsouth.net',
    'sbcglobal.net',
    'earthlink.net',
    'rogers.com',
    'telus.net',
    'shaw.ca',
    'sympatico.ca',
    'virginmobile.ca',
    'virginmedia.com',
];

// Check if the email is a work email
export const isWorkEmail = (email: string): boolean => {
  const domain = email.split('@')[1];
  return !PERSONAL_EMAIL_DOMAINS.includes(domain);
};
