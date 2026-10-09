/**
 * Recursively removes undefined fields from an object or array before Firestore serialization.
 */
export function sanitizeFirestorePayload<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestorePayload(item)) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    if (value !== undefined) {
      const sanitizedChild = sanitizeFirestorePayload(value);
      if (sanitizedChild !== undefined) {
        cleaned[key] = sanitizedChild;
      }
    }
  }
  return cleaned as T;
}

export function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { integerValue: val.toString() };
    }
    return { doubleValue: val };
  }
  if (val instanceof Date) {
    return { timestampValue: val.toISOString() };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.filter((item) => item !== undefined).map(toFirestoreValue),
      },
    };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

export function fromFirestoreFields(fields: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  if (!fields) return result;

  for (const [key, valObj] of Object.entries(fields)) {
    if (valObj.stringValue !== undefined) result[key] = valObj.stringValue;
    else if (valObj.integerValue !== undefined) result[key] = parseInt(valObj.integerValue, 10);
    else if (valObj.doubleValue !== undefined) result[key] = valObj.doubleValue;
    else if (valObj.booleanValue !== undefined) result[key] = valObj.booleanValue;
    else if (valObj.timestampValue !== undefined) result[key] = valObj.timestampValue;
    else if (valObj.nullValue !== undefined) result[key] = null;
    else if (valObj.arrayValue?.values) {
      result[key] = valObj.arrayValue.values.map((item: any) => fromFirestoreFields({ val: item }).val);
    } else if (valObj.mapValue?.fields) {
      result[key] = fromFirestoreFields(valObj.mapValue.fields);
    }
  }

  return result;
}

/**
 * Retrieves a document from Firestore REST API
 */
export async function getFirestoreDoc(
  projectId: string,
  collection: string,
  docId: string,
  authToken?: string
): Promise<Record<string, any> | null> {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}/${encodeURIComponent(docId)}`;
  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return null;
    }
    const json = (await res.json()) as any;
    if (!json?.fields) return null;

    const data = fromFirestoreFields(json.fields);
    data.id = json.name ? json.name.split('/').pop() : docId;
    return data;
  } catch (err) {
    console.error(`Error fetching Firestore doc ${collection}/${docId}:`, err);
    return null;
  }
}

/**
 * Creates or overwrites a document in Firestore via REST API
 */
export async function createFirestoreDoc(
  projectId: string,
  collection: string,
  docId: string,
  data: Record<string, any>,
  authToken?: string
): Promise<string> {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}?documentId=${encodeURIComponent(docId)}`;

  const sanitized = sanitizeFirestorePayload(data);
  const fields: Record<string, any> = {};
  for (const [key, value] of Object.entries(sanitized)) {
    if (value !== undefined) {
      fields[key] = toFirestoreValue(value);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Firestore document creation failed (${res.status}): ${errText}`);
  }

  const json = (await res.json()) as any;
  return json.name ? json.name.split('/').pop() : docId;
}

/**
 * Checks for existing duplicate application in Firestore for same email + jobId
 */
export async function checkDuplicateApplicationInFirestore(
  projectId: string,
  email: string,
  jobId: string,
  authToken?: string
): Promise<boolean> {
  if (!email || !jobId) return false;

  const normalizedEmail = email.toLowerCase().trim();
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

  const queryBody = {
    structuredQuery: {
      from: [{ collectionId: 'applications' }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: 'jobId' },
                op: 'EQUAL',
                value: { stringValue: jobId },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: 'normalizedEmail' },
                op: 'EQUAL',
                value: { stringValue: normalizedEmail },
              },
            },
          ],
        },
      },
      limit: 1,
    },
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(queryBody),
    });

    if (!res.ok) {
      return false;
    }

    const items = (await res.json()) as any[];
    if (Array.isArray(items)) {
      return items.some((item) => item.document && item.document.name);
    }
    return false;
  } catch (err) {
    console.warn('Error checking duplicate in Firestore:', err);
    return false;
  }
}
