export function generateRandomRoomId(): string {
    let id = '';
    while (id.length < 64) {
        id += Math.random().toString(36).substring(2, 15);
    }
    return id.substring(0, 64);
}