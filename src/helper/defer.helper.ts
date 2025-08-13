const topMargin = '200px';
const bottomMargin = '200px';
const leftMargin = '0px';
const rightMargin = '0px';

export class DeferHelper {
    static OBSERVER_OPTIONS: IntersectionObserverInit = {
        rootMargin: `${topMargin} ${rightMargin} ${bottomMargin} ${leftMargin}`,
        threshold: 0
    };

    public static defer(container: HTMLElement) {
        const images = container.querySelectorAll<HTMLImageElement>('img[data-src]');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            console.log('defer loaded...');
                            const img = entry.target as HTMLImageElement;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    });
                }, this.OBSERVER_OPTIONS);

            images.forEach((img) => {
                observer.observe(img);
            });
        } else {
            // Fallback for browsers that do not support IntersectionObserver
            images.forEach((img) => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
}