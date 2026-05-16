/**
 * Ads service stub.
 *
 * In production replace this with a real AdMob integration:
 *   - react-native-google-mobile-ads (expo plugin available)
 *   - or expo-ads-admob (deprecated but still used)
 *
 * This stub simulates a rewarded ad with a 1-second delay so the rest
 * of the app can be built and tested without native ad SDKs.
 */

export type AdResult = 'rewarded' | 'dismissed' | 'error';

let _adReady = true; // stub always has an ad ready

export function isAdReady(): boolean {
  return _adReady;
}

/**
 * Show a rewarded video ad.
 * Resolves with 'rewarded' when the user earns the reward,
 * 'dismissed' if they close early, or 'error' on failure.
 */
export async function showRewardedAd(): Promise<AdResult> {
  return new Promise((resolve) => {
    // TODO: replace with real AdMob rewarded ad call.
    // Example with react-native-google-mobile-ads:
    //
    // import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
    // const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXX/XXXXX';
    // const rewarded = RewardedAd.createForAdRequest(adUnitId);
    // rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => resolve('rewarded'));
    // rewarded.addAdEventListener(RewardedAdEventType.CLOSED, () => resolve('dismissed'));
    // rewarded.load();

    console.log('[Ads] Showing rewarded ad (stub)…');
    setTimeout(() => {
      console.log('[Ads] Rewarded ad completed (stub).');
      resolve('rewarded');
    }, 1000);
  });
}
