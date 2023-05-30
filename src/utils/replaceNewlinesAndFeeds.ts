function replaceNewlinesAndFeeds(input: string): string {

  return input
  .replace(/­\n/g, '')
  .replace(/­\n\f/g, '')
  .replace(/\u00AD/g, '') // Remove soft hyphen (\u00AD)
  .replace(/(\S)(?:[\n\f]+|[\n\f]+[\n\f]+)(?=\S|\p{P})/gu, '$1 ')
  .replace(/[\n\f]+/gu, '')
}


export default replaceNewlinesAndFeeds;