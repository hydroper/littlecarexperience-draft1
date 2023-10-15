import ScreenSize from '@/app/util/ScreenSize';

export default function optimalFitRatio(originalSize: ScreenSize, fitToSize: ScreenSize): number {
    const horizontalRatio = fitToSize.width / originalSize.width;
    const verticalRatio = fitToSize.height / originalSize.height;
    return Math.min(horizontalRatio, verticalRatio);
}