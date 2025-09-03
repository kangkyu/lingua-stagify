import { TranslationServiceClient } from '@google-cloud/translate';

const translationClient = new TranslationServiceClient();

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = 'global';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Missing text or targetLanguage in request body' });
    }

    try {
      const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain',
        targetLanguageCode: targetLanguage,
      };

      const [response] = await translationClient.translateText(request);

      if (!response.translations || response.translations.length === 0) {
        return res.status(500).json({ error: 'Translation returned no result' });
      }

      const translatedText = response.translations[0].translatedText;

      res.status(200).json({ translatedText });
    } catch (error) {
      console.error('Error translating text:', error);
      res.status(500).json({ error: 'Failed to translate text' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
