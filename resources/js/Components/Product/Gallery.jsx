import { useState } from 'react';
import PlaceholderImage from '@/Components/UI/PlaceholderImage';

export default function Gallery({ images }) {
    const [active, setActive] = useState(0);

    return (
        <div>
            <PlaceholderImage label={images[active]} aspect="aspect-square" className="w-full" />

            {images.length > 1 && (
                <div className="mt-3 flex gap-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setActive(index)}
                            className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border ${
                                index === active ? 'border-heading' : 'border-border'
                            }`}
                        >
                            <PlaceholderImage label={image} aspect="aspect-square" className="h-full w-full" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
