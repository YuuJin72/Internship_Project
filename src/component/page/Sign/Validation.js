const nicknamePattern = new RegExp(/^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/);
const passwordPattern = new RegExp(/^[A-z0-9]{8,12}$/);
const emailPattern = new RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i)

export const Validation = {nicknamePattern, passwordPattern, emailPattern}
