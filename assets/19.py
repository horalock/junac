def can_win_in_one_move(S):
    """Проверяет, может ли игрок выиграть за один ход из позиции S"""
    return (S - 3 <= 15) or (S - 4 <= 15) or (S // 2 <= 15)

def pete_cannot_win(S):
    """Петя НЕ может выиграть за один ход"""
    move1 = S - 3
    move2 = S - 4
    move3 = S // 2
    return all(move > 15 for move in [move1, move2, move3])

def vanya_can_win_after_pete(S):
    """Проверяет, что при любом ходе Пети Ваня может выиграть за один ход"""
    moves_after_pete = [S - 3, S - 4, S // 2]
    for T in moves_after_pete:
        if T <= 15:
            # Игра уже закончилась — Петя выиграл, но это противоречит условию
            return False
        if not can_win_in_one_move(T):
            return False  # Ваня не может выиграть после этого хода
    return True

# Перебираем S от 16 до 100
result = 0
for S in range(16, 101):
    if pete_cannot_win(S) and vanya_can_win_after_pete(S):
        result = S  # Нам нужно максимальное S, так что просто запоминаем последнее

print("Максимальное значение S:", result)
