import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  structuredData?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Trendify - Premium E-commerce Store",
  description = "Shop premium products at Trendify. Discover quality items with fast shipping and excellent customer service.",
  keywords = "ecommerce, shopping, premium products, online store, fashion, electronics",
  image = "/og-image.jpg", // Default OG image
  url,
  type = "website",
  noindex = false,
  structuredData,
}) => {
  const siteUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Trendify" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional meta tags */}
      <meta
        name="robots"
        content={noindex ? "noindex,nofollow" : "index,follow"}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Predefined SEO configurations for common pages
export const createProductSEO = (product: {
  name: string;
  description: string;
  price: number;
  image: string;
  brand?: string;
  category?: string;
  sku?: string;
}) => ({
  title: `${product.name} - Trendify`,
  description: product.description,
  image: product.image,
  type: "product" as const,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand } }),
    ...(product.category && { category: product.category }),
    ...(product.sku && { sku: product.sku }),
  },
});

export const createCategorySEO = (category: {
  name: string;
  description: string;
  image?: string;
}) => ({
  title: `${category.name} - Shop Online | Trendify`,
  description: category.description,
  image: category.image || "/category-default.jpg",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
  },
});

export const createArticleSEO = (article: {
  title: string;
  description: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
}) => ({
  title: `${article.title} - Trendify Blog`,
  description: article.description,
  image: article.image,
  type: "article" as const,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    ...(article.author && {
      author: {
        "@type": "Person",
        name: article.author,
      },
    }),
  },
});
