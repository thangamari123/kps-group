// WhatsApp hand-off for the Contact Us form: builds the message and the wa.me link.
import { companyDetails } from '@/data/company';

export interface WhatsAppEnquiry {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
}

// WhatsApp rejects very long links; the form has no length limit on the message, so cap it.
const MAX_MESSAGE_CHARS = 1500;

/** Business WhatsApp number in international format (digits only), from the existing company config. */
export function getWhatsAppNumber(): string {
  const contact = companyDetails.contact;
  const fromUrl = /wa\.me\/(\d{8,15})/.exec(contact.whatsappUrl || '')?.[1];
  return fromUrl || (contact.whatsapp || '').replace(/\D/g, '');
}

/** Plain-text, WhatsApp-formatted (bold labels) enquiry message. */
export function buildWhatsAppMessage(e: WhatsAppEnquiry): string {
  const message = e.message.length > MAX_MESSAGE_CHARS ? `${e.message.slice(0, MAX_MESSAGE_CHARS)}…` : e.message;
  return [
    '*New Enquiry - KPS Worldwide Logistics (Contact Us)*',
    '',
    `*Name:* ${e.name}`,
    `*Email:* ${e.email}`,
    `*Phone:* ${e.countryCode} ${e.phone}`,
    `*Company:* ${e.company?.trim() || '-'}`,
    `*Service Required:* ${e.service}`,
    '',
    '*Message:*',
    message,
  ].join('\n');
}

export function buildWhatsAppUrl(text: string, number = getWhatsAppNumber()): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
