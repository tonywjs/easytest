(function() {
  'use strict';

  window.ChallengeUtils = {
    /**
     * Encode data object to URL-safe Base64 string
     * @param {Object} data - Data to encode
     * @returns {string} URL-safe Base64 string
     */
    encode: function(data) {
      try {
        var json = JSON.stringify(data);
        var base64 = btoa(unescape(encodeURIComponent(json)));
        // Make URL-safe: replace + with -, / with _, remove =
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } catch (e) {
        console.error('ChallengeUtils.encode error:', e);
        return null;
      }
    },

    /**
     * Decode URL-safe Base64 string back to data object
     * @param {string} str - URL-safe Base64 string
     * @returns {Object|null} Decoded data or null on failure
     */
    decode: function(str) {
      try {
        // Reverse URL-safe: replace - with +, _ with /
        var base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (base64.length % 4) {
          base64 += '=';
        }
        var json = decodeURIComponent(escape(atob(base64)));
        return JSON.parse(json);
      } catch (e) {
        console.error('ChallengeUtils.decode error:', e);
        return null;
      }
    },

    /**
     * Create a challenge URL for sharing
     * @param {string} testType - Test type identifier (e.g., 'reaction', 'color', 'aim', 'typing', 'pattern')
     * @param {number} seed - Random seed used for the game
     * @param {number|string} score - The challenger's score
     * @returns {string} Full challenge URL
     */
    createChallengeURL: function(testType, seed, score) {
      var data = {
        t: testType,
        s: seed,
        sc: score,
        v: 1  // version for future compatibility
      };
      var encoded = this.encode(data);
      if (!encoded) return window.location.href;

      // Build URL based on test type
      var testPaths = {
        reaction: 'reactiontest',
        color: 'colortest',
        aim: 'aimtest',
        typing: 'typingtest',
        pattern: 'patterntest'
      };

      var basePath = testPaths[testType] || testType;
      var origin = window.location.origin;
      var pathPrefix = window.location.pathname.replace(/\/[^\/]*\/.*$/, '');

      return origin + pathPrefix + '/' + basePath + '/?challenge=' + encoded;
    },

    /**
     * Parse challenge data from current URL
     * @returns {Object|null} Challenge data { testType, seed, score, version } or null
     */
    parseChallenge: function() {
      var params = new URLSearchParams(window.location.search);
      var challengeStr = params.get('challenge');
      if (!challengeStr) return null;

      var data = this.decode(challengeStr);
      if (!data) return null;

      return {
        testType: data.t,
        seed: data.s,
        score: data.sc,
        version: data.v || 1
      };
    },

    /**
     * Generate a random seed
     * @returns {number} Random seed integer
     */
    generateSeed: function() {
      return Math.floor(Math.random() * 2147483647);
    }
  };
})();
