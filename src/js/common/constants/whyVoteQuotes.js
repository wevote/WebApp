import webAppConfig from '../../config';
import normalizedImagePath from '../utils/normalizedImagePath';

if (window.cordova) { // Static constants are initialized before the app starts
  webAppConfig.IS_CORDOVA = true;
  window.isCordovaGlobal = true;
}

const photoPath = normalizedImagePath('/img/global/public-figures/');

// eslint-disable-next-line import/prefer-default-export
export const publicFigureQuotes = [{
  imageUrl: `${photoPath}Beyonce-100x100.jpeg`,
  testimonial: 'Too many people have died and sacrificed so much for us to have our voice, we have to use it. Get in formation. Use our voices to do something great for our children.',
  testimonialAuthor: 'Beyoncé',
},
{
  imageUrl: `${photoPath}Billy_Eilish-100x100.jpeg`,
  testimonial: 'We all have to vote like our lives and the world depend on it, because they do. The only way to be certain of the future is to make it ourselves.',
  testimonialAuthor: 'Billie Eilish',
},
{
  imageUrl: `${photoPath}George_Carlin-100x100.jpeg`,
  testimonial: 'If you don’t vote, you lose the right to complain.',
  testimonialAuthor: 'George Carlin',
},
{
  imageUrl: `${photoPath}Lenny_Kravitz-100x100.jpeg`,
  testimonial: 'It’s very important to vote. People died for this right.',
  testimonialAuthor: 'Lenny Kravitz',
},
{
  imageUrl: `${photoPath}Ronald_Reagan-100x100.jpeg`,
  testimonial: 'The right to vote is the crown jewel of American liberties.',
  testimonialAuthor: 'Ronald Reagan',
},
{
  imageUrl: `${photoPath}Barak_Obama-100x100.jpeg`,
  testimonial: 'Don’t boo, vote.',
  testimonialAuthor: 'Barak Obama',
},
];
