import crypto from "crypto";

export const generateScaleHash = () => {
  const date = new Date();
  const currentHour = date.getHours();
  const currentMinute = Math.floor(date.getMinutes() / 5) * 5;
  const randomizer = Math.floor(Math.random() * 10);
  const permanentSalt = process.env.NEXT_PUBLIC_SCALE_SALT;

  const temporarySalt = `${currentHour}${currentMinute}`;
  const dataToHash = `${permanentSalt}${temporarySalt}${randomizer}`;

  console.log(dataToHash);
  const generatedHash = crypto
    .createHash("sha256")
    .update(dataToHash)
    .digest("hex");

  return generatedHash;
};