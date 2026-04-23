import dotenv from 'dotenv';
dotenv.config();

async function list() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    console.log(JSON.stringify(data.models.map(m => m.name).filter(n => n.includes('gemini-1.5')), null, 2));
  } catch(e) {
    console.error(e);
  }
}
list();
