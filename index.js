require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const supabaseClient = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_KEY ?? '',
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/climate', async (_, res) => {
  const { data } = await supabaseClient.from('climate').select();

  return res.status(200).json(data);
});

app.post('/climate', async (req, res) => {
  const { error } = await supabaseClient
    .from('climate')
    .insert({ temperature: req.body.temperature, humidity: req.body.humidity });

  if (error) {
    return res.status(400).json({ error: 'Something went wrong' });
  }

  return res.status(201).json({ message: 'Added new climate change' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Application running on PORT: ${PORT}`);
});
