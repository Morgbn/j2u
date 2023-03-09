/**
 * Download contents as a file
 *
 * @param content file content
 * @param filename file name
 * @param contentType ex: text/csv;charset=utf-8;
 */
export function downloadBlob (content: string, filename: string, contentType: string) {
  // Create a blob
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  // Create a link to download it
  const pom = document.createElement('a')
  pom.href = url
  pom.setAttribute('download', filename)
  pom.click()
}

/**
 * Convert a 2D array into a CSV string
 * from https://stackoverflow.com/a/68146412
 *
 * @param data array
 */
export function arrayToCsv (data: any[]): string {
  return data.map(row =>
    row
      .map(String) // convert every value to String
      .map((v: string) => v.replaceAll('"', '""')) // escape double colons
      .map((v: string) => `"${v}"`) // quote it
      .join(',') // comma-separated
  ).join('\r\n') // rows starting on new lines
}
