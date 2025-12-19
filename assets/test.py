def f(a,m,step):
    if a >= 231: return m % 2 == 0
    if m == 0: return 0
    if step == 'P':
        h = [f(a + 3,m - 1,'V'), f(a * 3,m - 1, 'V')]
    else:
        h = [f(a + 5,m - 1,'P'), f(a * 3,m - 1, 'P')]
    return any(h) if m % 2 else all(h)

print('19)',min(i for i in range(10,121) if f(i,2,'P')))
print('20)',*[i for i in range(10,121) if f(i,3,'P') and (not(f(i,1,'P')))][:2])
print('21)',max(i for i in range(10,121 ) if f(i,4,'P') and (not(f(i,2,'P')))))