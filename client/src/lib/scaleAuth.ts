export const generateScaleHash = async () => {
  // Get the current date and time in UTC
  const date = new Date();

  // Define the permanent salt
  const permanentSalt = "5adf9a7c3be84f966c00dc5c33a4a115f311eb1a962e540c0beccdc5d6d171d4";

  // Create a temporary salt using the current UTC hour and rounded UTC minutes
  const currentHour = date.getUTCHours();
  const currentMinute = Math.floor(date.getUTCMinutes() / 5) * 5;
  const temporarySalt = `${currentHour}${currentMinute}`;

  // Generate a random number between 0 and 9
  const randomizer = Math.floor(Math.random() * 10);

  // Concatenate the salts and the randomizer to form the data to hash
  const dataToHash = `${permanentSalt}${temporarySalt}${randomizer}`;

  // Generate the SHA-256 hash of the data
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(dataToHash));

  // Convert the hash buffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
};