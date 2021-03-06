const {theCommandRun, closeWithSuccess, newSimpleGit, newSimpleGitP, restore, wait} = require('./include/setup');

describe('checkout', () => {
   let git, callback;

   beforeEach(() => {
      git = newSimpleGit();
      callback = jest.fn();
   });
   afterEach(() => restore());

   it('checkout with trailing options array', async () => {
      const queue = git.checkout('something', ['--track', 'upstream/something']);

      await closeWithSuccess();
      await queue;

      expect(theCommandRun()).toEqual(['checkout', 'something', '--track', 'upstream/something']);
   })

   it('checkout with trailing options object', async () => {
      const queue = git.checkout('something', {'--track': null, 'upstream/something': null});

      await closeWithSuccess();
      await queue;

      expect(theCommandRun()).toEqual(['checkout', 'something', '--track', 'upstream/something']);
   });

   it('checkout with just trailing options array', async () => {
      const queue = git.checkout(['-b', 'foo']);

      await closeWithSuccess();
      await queue;

      expect(theCommandRun()).toEqual(['checkout', '-b', 'foo']);
   })

   it('checkout with just trailing options object', async () => {
      const queue = git.checkout({'-b': null, 'my-branch': null});

      await closeWithSuccess();
      await queue;

      expect(theCommandRun()).toEqual(['checkout', '-b', 'my-branch']);
   });

   it('simple checkout with callback', async function () {
      git.checkout('something', callback);

      await closeWithSuccess();
      await wait();

      expect(callback).toHaveBeenCalledWith(null, expect.any(String));
      expect(theCommandRun()).toEqual(['checkout', 'something'])
   });

   describe('checkoutLocalBranch', () => {
      it('with callback', async () => {
         git.checkoutLocalBranch('new-branch', callback);
         await closeWithSuccess();
         await wait();

         expect(callback).toHaveBeenCalledWith(null, expect.any(String));
         expect(theCommandRun()).toEqual(['checkout', '-b', 'new-branch']);
      });

      it('as promise', async () => {
         const queue = git.checkoutLocalBranch('new-branch');
         await closeWithSuccess();
         await queue;

         expect(theCommandRun()).toEqual(['checkout', '-b', 'new-branch']);
      });
   });

   describe('checkoutBranch', () => {

      it('with callback', async function () {
         git.checkoutBranch('branch', 'start', callback);

         await closeWithSuccess();
         await wait();

         expect(callback).toHaveBeenCalledWith(null, expect.any(String));
         expect(theCommandRun()).toEqual(['checkout', '-b', 'branch', 'start']);
      });

      it('as promise', async function () {
         const result = git.checkoutBranch('abc', 'def');

         await closeWithSuccess();
         expect(await result).toEqual(expect.any(String));
         expect(theCommandRun()).toEqual(['checkout', '-b', 'abc', 'def']);
      });

   });

});
