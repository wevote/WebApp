export default function extractPoliticianDetailsFromUrl (url) {
  // Check URL exists
  if (!url) {
    return { state: null, name: null };
  }
  // Split the URL into parts using '/'
  const parts = url.split('/');

  // assume the second part of the path is the SEO-friendly string ("nancy-a-montgomery-politician-from-new-york")
  const seoFriendlyPart = parts[1];

  if (!seoFriendlyPart) {
    return { state: null, name: null };  // If there's no seoFriendlyPart, return null for state and name
  }

  // Split the SEO-friendly part by dashes to get the name and state words
  const words = seoFriendlyPart.split('-');
  // Capitalize each word in the array
  const capitalizeWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  const fromIndex = capitalizeWords.lastIndexOf('From');   // Look for the last occurrence of "from", as it typically separates the name and state, reduce chances of pulling "from" in the name

  if (fromIndex === -1) {
    const nameWithoutFrom = capitalizeWords.slice(0, words.length).join(' '); // Creates a name for urls without 'from'
    const nameWithoutFromAndPolitician = nameWithoutFrom ? nameWithoutFrom.replace(/\bpolitician\b/i, '').trim() : null;
    return { state: null, name: nameWithoutFromAndPolitician }; // If 'from' is not found, return null for both
  }

  // Extract state and name based on the position of 'from'
  const state = capitalizeWords.slice(fromIndex + 1).join(' ');  // Combine words after 'from' for the state
  const name = capitalizeWords.slice(0, fromIndex).join(' ');   // Combine words before 'from' for the name
  const nameWithoutPolitician = name ? name.replace(/\bpolitician\b/i, '').trim() : null;

  return { state, name: nameWithoutPolitician };
}
