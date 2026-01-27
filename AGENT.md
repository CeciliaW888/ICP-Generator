# AGENT.md

This file documents bugs encountered and their solutions to prevent repeating the same mistakes.

## Google Gemini API Issues

### 1. `response.text` is a property, not a method

**Symptom:** `TypeError: response.text is not a function`

**Wrong:**
```javascript
const jsonText = response.text();
```

**Correct:**
```javascript
const jsonText = response.text;
```

**Root cause:** In `@google/genai` SDK v1.0.0, the response object has `text` as a string property, not a method.

---

### 2. JSON responses wrapped in markdown code blocks

**Symptom:** `SyntaxError: Unexpected token '\`', "\`\`\`json...`

**Root cause:** When not using `responseSchema`, Gemini often returns JSON wrapped in markdown code blocks:
```
```json
{ "key": "value" }
```
```

**Solution:** Strip markdown code blocks before parsing:
```javascript
let jsonText = response.text.trim();
if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
}
const parsed = JSON.parse(jsonText);
```

---

### 3. `responseSchema` incompatible with Google Search tool

**Symptom:** `400 Error: controlled generation is not supported with Search tool`

**Root cause:** Google's Gemini API does not allow using `responseSchema` (structured JSON output) AND `googleSearch` tool together in the same request.

**Solution:** When using `googleSearch`, remove `responseSchema` and `responseMimeType` from config. Instead, instruct the model to return JSON in the prompt and parse it manually (with markdown stripping as above).

**Wrong:**
```javascript
const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: MY_SCHEMA,  // NOT ALLOWED with googleSearch
    }
});
```

**Correct:**
```javascript
const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt + '\n\nReturn your response as valid JSON matching this structure: {...}',
    config: {
        tools: [{ googleSearch: {} }],
        // No responseSchema or responseMimeType
    }
});
```

---

### 4. Outdated model names

**Symptom:** `404 Error: models/gemini-1.5-pro is not found for API version v1beta`

**Root cause:** Model names change over time. Old names like `gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-2.0-flash-exp` may no longer be valid.

**Solution:** Use current model names:
```javascript
const MODEL_CHAIN = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'];
```

---

### 5. Environment variable not updating

**Symptom:** API key from `.env` file not being used, old invalid key still active

**Root cause:** `dotenv` does NOT override existing system environment variables. If `GOOGLE_API_KEY` is set at the system level, it takes precedence over `.env` file.

**Solution:**
- Remove system environment variable, OR
- Explicitly set the variable when running: `GOOGLE_API_KEY=xxx node index.js`
- Restart terminal after changing system environment variables
