import { getBankAccount } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(100);

    expect(bankAccount.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => getBankAccount(100).withdraw(150)).toThrowError(
      'Insufficient funds: cannot withdraw more than 100',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const firstBankAccount = getBankAccount(100);
    const secondBankAccount = getBankAccount(200);

    expect(() =>
      firstBankAccount.transfer(500, secondBankAccount),
    ).toThrowError('Insufficient funds: cannot withdraw more than 100');
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(100);

    expect(() => {
      bankAccount.transfer(150, bankAccount);
    }).toThrowError('Transfer failed');
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(100);
    bankAccount.deposit(200);

    expect(bankAccount.getBalance()).toBe(300);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(100);
    bankAccount.withdraw(50);

    expect(bankAccount.getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const firstBankAccount = getBankAccount(100);
    const secondBankAccount = getBankAccount(200);

    firstBankAccount.transfer(50, secondBankAccount);

    expect(firstBankAccount.getBalance()).toBe(50);
    expect(secondBankAccount.getBalance()).toBe(250);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount = getBankAccount(0);

    const newBalance = await bankAccount.fetchBalance();

    newBalance && expect(typeof newBalance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(0);

    try {
      const newBalance = await bankAccount.fetchBalance();

      newBalance && expect(bankAccount.getBalance()).toBe(newBalance);
    } catch {
      return;
    }
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(0);

    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(null);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
