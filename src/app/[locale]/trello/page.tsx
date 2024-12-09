'use client';

import {useTranslations} from 'next-intl';
import { Button, Typography, Container, TextField} from '@mui/material';

export default function TrelloPowerUpPage() {
  const t = useTranslations('trello');

  return (
    <Container>
      <form id="caps">
      <TextField 
      label={t('caps.form.effort')}
      fullWidth
      // value={formData.bylaws?.[bylawKey] || ''}
      // onChange={onFieldChange(`bylaws.${bylawKey}`)}
      // fullWidth
      // // error={wasSubmitted && CORE_FIELDS.name.required && !formData.name}
      // onKeyPress={onInputKeyPressed}
        value="0"
        type="number"
        min="0"
        max="30"
        step="0.5"
        name="effort"
        id="effortInput"
      />

      <label for="complexity">Complexity (1-5):</label>
      <input
        value="3"
        type="number"
        min="1"
        max="5"
        step="1"
        name="complexity"
        id="complexityInput"
      />

      <label for="modifier">Industry Modifier:</label>
      <select name="modifier" id="industryInput">
        <option value="software">Software (x1.5)</option>
        <option value="web-design">Web Design (x1.5)</option>
      </select>

      <label for="caps">RESULTING CAPS:</label>
      <input
        disabled
        type="number"
        step="0.01"
        name="capsOutput"
        id="capsOutput"
      />

      <button type="submit" class="mod-primary">Save</button>
    </form>
      <Typography variant="h4" gutterBottom>
        {}
      </Typography>
    </Container>
  );
}