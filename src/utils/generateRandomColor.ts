// This util is taken from https://css-tricks.com/snippets/javascript/random-hex-color/

export const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}