import sanitizeHtml from 'sanitize-html';

export const cleanText = (value) => {
    if (value === undefined || value === null) {
        return value;
    }

    return sanitizeHtml(String(value).trim(), {
        allowedTags: [],
        allowedAttributes: {}
    });
};

export const cleanObject = (payload) => Object.fromEntries(
    Object.entries(payload || {}).map(([key, value]) => [key, typeof value === 'string' ? cleanText(value) : value])
);
