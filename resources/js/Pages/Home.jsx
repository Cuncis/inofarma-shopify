import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import Slideshow from '@/Components/Sections/Slideshow';
import LogoList from '@/Components/Sections/LogoList';
import FeaturedCollection from '@/Components/Sections/FeaturedCollection';
import CollectionList from '@/Components/Sections/CollectionList';
import CollectionListRectangleImage from '@/Components/Sections/CollectionListRectangleImage';
import BlogPosts from '@/Components/Sections/BlogPosts';
import Testimonials from '@/Components/Sections/Testimonials';
import RichText from '@/Components/Sections/RichText';
import Faq from '@/Components/Sections/Faq';

const SECTION_COMPONENTS = {
    slideshow: Slideshow,
    'logo-list': LogoList,
    'featured-collection': FeaturedCollection,
    'collection-list': CollectionList,
    'collection-list-rectangle-image': CollectionListRectangleImage,
    'blog-posts': BlogPosts,
    testimonials: Testimonials,
    'rich-text': RichText,
    faq: Faq,
};

export default function Home({ sections }) {
    return (
        <StorefrontLayout>
            <Head title="Apotek Inofarma" />

            {sections.map((section, index) => {
                const SectionComponent = SECTION_COMPONENTS[section.type];

                if (!SectionComponent) {
                    return null;
                }

                return <SectionComponent key={`${section.type}-${index}`} section={section} />;
            })}
        </StorefrontLayout>
    );
}
