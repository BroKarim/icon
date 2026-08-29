export const favoriteIcons = useStorage<string[]>('icones-favorite-icons', [])

export function toggleFavorite(id: string) {
  const index = favoriteIcons.value.indexOf(id)
  if (index >= 0)
    favoriteIcons.value.splice(index, 1)
  else
    favoriteIcons.value.push(id)
}

export function inFavorites(id: string) {
  return favoriteIcons.value.includes(id)
}

export function removeFromFavorites(id: string) {
  const index = favoriteIcons.value.indexOf(id)
  if (index >= 0)
    favoriteIcons.value.splice(index, 1)
}

export function clearFavorites() {
  favoriteIcons.value = []
}
