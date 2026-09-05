--
-- PostgreSQL database dump
--

\restrict c5AYKiZHzbdzCVzeteoIhd6hPJLmoms0yJ3QmiUdhFNkcZs0Mawf8oPFuWUrXdi

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AddressType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AddressType" AS ENUM (
    'BILLING',
    'SHIPPING',
    'BOTH'
);


--
-- Name: CancellationReason; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CancellationReason" AS ENUM (
    'CHANGED_MIND',
    'DELIVERY_TIME_LONG',
    'BETTER_PRICE_FOUND',
    'PRODUCT_INFO_ERROR',
    'OTHER'
);


--
-- Name: CancellationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CancellationStatus" AS ENUM (
    'REQUESTED',
    'APPROVED',
    'REJECTED',
    'REFUNDED'
);


--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENT',
    'FIXED'
);


--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'QUEUED',
    'SENT',
    'REJECTED',
    'ERROR',
    'CANCELLED'
);


--
-- Name: InvoiceType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceType" AS ENUM (
    'EFATURA',
    'EARSIV'
);


--
-- Name: Language; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Language" AS ENUM (
    'TR',
    'EN'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
);


--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);


--
-- Name: ReturnReason; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ReturnReason" AS ENUM (
    'DEFECTIVE',
    'WRONG_ITEM',
    'NOT_AS_DESCRIBED',
    'CHANGED_MIND',
    'DAMAGED_SHIPPING',
    'OTHER'
);


--
-- Name: ReturnStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ReturnStatus" AS ENUM (
    'REQUESTED',
    'APPROVED',
    'REJECTED'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'CUSTOMER',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id text NOT NULL,
    user_id text NOT NULL,
    type public."AddressType" DEFAULT 'SHIPPING'::public."AddressType" NOT NULL,
    title text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    city text NOT NULL,
    district text NOT NULL,
    neighborhood text,
    postal_code text,
    address text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: attribute_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attribute_values (
    id text NOT NULL,
    attribute_id text NOT NULL,
    value text NOT NULL,
    color_hex text,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attributes (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    input_type text DEFAULT 'select'::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brands (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name_en text
);


--
-- Name: campaign_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_products (
    id text NOT NULL,
    campaign_id text NOT NULL,
    product_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaigns (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    discount_text text NOT NULL,
    discount_amount numeric(10,2),
    discount_type text DEFAULT 'percentage'::text,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    show_on_home boolean DEFAULT false NOT NULL,
    color text DEFAULT 'primary'::text NOT NULL,
    display_type text DEFAULT 'sticky'::text NOT NULL,
    image_url text,
    cta_text text,
    cta_link text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id text NOT NULL,
    cart_id text NOT NULL,
    variant_id text NOT NULL,
    quantity integer NOT NULL,
    price_at_add numeric(10,2) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id text NOT NULL,
    user_id text,
    session_id text,
    expires_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id text NOT NULL,
    parent_id text,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    image_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    show_in_menu boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description_en text,
    name_en text
);


--
-- Name: chatbot_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chatbot_rules (
    id text NOT NULL,
    title text NOT NULL,
    keywords text[],
    response text NOT NULL,
    quick_replies text[],
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id text NOT NULL,
    user_id text,
    email text NOT NULL,
    name text NOT NULL,
    subject text,
    body text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: discount_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discount_campaigns (
    id text NOT NULL,
    name text NOT NULL,
    discount_text text NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    show_on_home boolean DEFAULT false NOT NULL,
    color text DEFAULT 'primary'::text NOT NULL,
    display_type text DEFAULT 'sticky'::text NOT NULL,
    cta_text text,
    cta_link text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: discount_usages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discount_usages (
    id text NOT NULL,
    discount_id text NOT NULL,
    user_id text NOT NULL,
    order_id text NOT NULL,
    used_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: discounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discounts (
    id text NOT NULL,
    code text NOT NULL,
    type public."DiscountType" NOT NULL,
    value numeric(10,2) NOT NULL,
    min_order numeric(10,2),
    max_uses integer,
    used_count integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    expires_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text,
    description text,
    source_order_id text
);


--
-- Name: feature_cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feature_cards (
    id text NOT NULL,
    icon text DEFAULT 'truck'::text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id text NOT NULL,
    order_id text NOT NULL,
    type public."InvoiceType" NOT NULL,
    status public."InvoiceStatus" DEFAULT 'DRAFT'::public."InvoiceStatus" NOT NULL,
    ettn text,
    belge_oid text,
    invoice_no text,
    profile text,
    pdf_url text,
    provider_response jsonb,
    error_message text,
    sent_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: nav_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nav_links (
    id text NOT NULL,
    label text NOT NULL,
    url text NOT NULL,
    open_in_new_tab boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id text NOT NULL,
    email text NOT NULL,
    status text DEFAULT 'confirmed'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: order_cancellations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_cancellations (
    id text NOT NULL,
    order_id text NOT NULL,
    status public."CancellationStatus" DEFAULT 'REQUESTED'::public."CancellationStatus" NOT NULL,
    reason public."CancellationReason" NOT NULL,
    description text,
    refund_amount numeric(10,2),
    admin_notes text,
    coupon_offered boolean DEFAULT false NOT NULL,
    coupon_code text,
    coupon_value numeric(10,2),
    requested_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_at timestamp(3) without time zone,
    refunded_at timestamp(3) without time zone,
    rejected_at timestamp(3) without time zone
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    order_id text NOT NULL,
    variant_id text NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL
);


--
-- Name: order_return_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_return_items (
    id text NOT NULL,
    return_id text NOT NULL,
    order_item_id text NOT NULL,
    quantity integer NOT NULL
);


--
-- Name: order_returns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_returns (
    id text NOT NULL,
    order_id text NOT NULL,
    user_id text NOT NULL,
    status public."ReturnStatus" DEFAULT 'REQUESTED'::public."ReturnStatus" NOT NULL,
    reason public."ReturnReason" NOT NULL,
    description text,
    refund_amount numeric(10,2),
    admin_notes text,
    admin_user_id text,
    requested_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_at timestamp(3) without time zone,
    rejected_at timestamp(3) without time zone
);


--
-- Name: order_status_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_status_logs (
    id text NOT NULL,
    order_id text NOT NULL,
    status public."OrderStatus" NOT NULL,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id text NOT NULL,
    user_id text NOT NULL,
    address_id text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    shipping_fee numeric(10,2) DEFAULT 0 NOT NULL,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    billing_name text,
    identity_no text,
    is_corporate boolean DEFAULT false NOT NULL,
    tax_number text,
    tax_office text
);


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    show_in_menu boolean DEFAULT true NOT NULL,
    show_in_header boolean DEFAULT true NOT NULL,
    show_in_footer boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    content_en text,
    title_en text
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id text NOT NULL,
    order_id text NOT NULL,
    provider text NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    transaction_id text,
    payload jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: popup_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.popup_notifications (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    image_url text,
    button_text text,
    button_link text,
    is_active boolean DEFAULT false NOT NULL,
    display_freq text DEFAULT 'session'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: price_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_history (
    id text NOT NULL,
    variant_id text NOT NULL,
    old_price numeric(10,2) NOT NULL,
    new_price numeric(10,2) NOT NULL,
    admin_user_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: product_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_answers (
    id text NOT NULL,
    question_id text NOT NULL,
    user_id text NOT NULL,
    body text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id text NOT NULL,
    product_id text NOT NULL,
    variant_id text,
    url text NOT NULL,
    alt_text text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_primary boolean DEFAULT false NOT NULL
);


--
-- Name: product_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_questions (
    id text NOT NULL,
    product_id text NOT NULL,
    user_id text,
    guest_name text,
    body text NOT NULL,
    is_answered boolean DEFAULT false NOT NULL,
    is_approved boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: product_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_tags (
    id text NOT NULL,
    product_id text NOT NULL,
    tag text NOT NULL
);


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id text NOT NULL,
    product_id text NOT NULL,
    sku text NOT NULL,
    price numeric(10,2) NOT NULL,
    compare_at numeric(10,2),
    stock_qty integer DEFAULT 0 NOT NULL,
    desi numeric(8,2),
    is_active boolean DEFAULT true NOT NULL,
    cost_price_override numeric(10,2),
    markup_percentage_override numeric(5,2),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id text NOT NULL,
    category_id text NOT NULL,
    brand_id text,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    vat_rate integer DEFAULT 20 NOT NULL,
    vat_included boolean DEFAULT true NOT NULL,
    pricing_method text DEFAULT 'fixed'::text NOT NULL,
    cost_price numeric(10,2),
    markup_percentage numeric(5,2),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    description_en text,
    description_tr text,
    name_en text
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    product_id text NOT NULL,
    user_id text NOT NULL,
    rating integer NOT NULL,
    title text,
    body text,
    is_approved boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: shippings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shippings (
    id text NOT NULL,
    order_id text NOT NULL,
    carrier text,
    tracking_number text,
    status text DEFAULT 'PREPARING'::text NOT NULL,
    estimated_at timestamp(3) without time zone,
    delivered_at timestamp(3) without time zone,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    key text NOT NULL,
    value text NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_movements (
    id text NOT NULL,
    variant_id text NOT NULL,
    old_qty integer NOT NULL,
    new_qty integer NOT NULL,
    difference integer NOT NULL,
    reason text NOT NULL,
    admin_user_id text,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id text NOT NULL,
    user_id text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    avatar_url text,
    bio text,
    avatar text,
    oauth_ids text[] DEFAULT ARRAY[]::text[],
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    first_name text DEFAULT ''::text NOT NULL,
    last_name text DEFAULT ''::text NOT NULL,
    password_hash text,
    role public."Role" DEFAULT 'CUSTOMER'::public."Role" NOT NULL,
    is_guest boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    refresh_tokens text[] DEFAULT ARRAY[]::text[],
    marketing_consent boolean DEFAULT false NOT NULL,
    mfa_enabled boolean DEFAULT false NOT NULL,
    mfa_secret text,
    backup_codes text[] DEFAULT ARRAY[]::text[],
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    admin_note text,
    sms_consent boolean DEFAULT false NOT NULL,
    terms_accepted_at timestamp(3) without time zone
);


--
-- Name: variant_attribute_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variant_attribute_values (
    variant_id text NOT NULL,
    attribute_value_id text NOT NULL
);


--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlist_items (
    id text NOT NULL,
    wishlist_id text NOT NULL,
    variant_id text NOT NULL,
    added_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlists (
    id text NOT NULL,
    user_id text NOT NULL,
    name text DEFAULT 'Favorilerim'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.addresses (id, user_id, type, title, first_name, last_name, phone, city, district, neighborhood, postal_code, address, is_default, created_at) FROM stdin;
cmr66a35f000knvh1k439hpav	cmr669iin000bnvh1unlp6u6b	SHIPPING	ev	onder	monder	5414113022	Antalya	Kepez	\N	07100	asd asda asdasd	t	2026-07-04 09:41:18.579
\.


--
-- Data for Name: attribute_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attribute_values (id, attribute_id, value, color_hex, sort_order) FROM stdin;
cmr665nf80002nvh18mo3rjdt	cmr665eam0000nvh13wnuligc	Mavi	\N	0
\.


--
-- Data for Name: attributes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attributes (id, name, slug, input_type, sort_order, is_active, created_at) FROM stdin;
cmr665eam0000nvh13wnuligc	Renk	renk	color	0	t	2026-07-04 09:37:39.741
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brands (id, name, slug, logo_url, is_active, created_at, name_en) FROM stdin;
\.


--
-- Data for Name: campaign_products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campaign_products (id, campaign_id, product_id, created_at) FROM stdin;
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campaigns (id, name, description, discount_text, discount_amount, discount_type, start_date, end_date, is_active, show_on_home, color, display_type, image_url, cta_text, cta_link, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, cart_id, variant_id, quantity, price_at_add, created_at) FROM stdin;
cmt060m51001kw757uzkmyu4w	cmt060m4s001iw7578iaz3ist	cmt04yko00016w7573xcbtjrz	1	1000.00	2026-08-19 14:06:44.245
cmtimwu570001bj3umrlu1zji	cmt041y3m0005w7576l19qckt	cmt04yko00016w7573xcbtjrz	1	1000.00	2026-09-01 12:19:32.636
cmtn2fb3m000jsa7euik8tyiu	cmtn2fb2j000hsa7e8s8irwnb	cmt04yko00016w7573xcbtjrz	1	1000.00	2026-09-04 14:44:53.36
cmtnzyxw50002w7zdvhvya40z	cmtnzyxvy0000w7zdmcmxg0cb	cmt04yko00016w7573xcbtjrz	1	1000.00	2026-09-05 06:23:56.693
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, user_id, session_id, expires_at, created_at, updated_at) FROM stdin;
cmr669ijw000envh1spo767qf	cmr669iin000bnvh1unlp6u6b	\N	\N	2026-07-04 09:40:51.885	2026-07-04 09:40:51.885
cmt041y3m0005w7576l19qckt	\N	adf884b0-c732-47a1-a92b-4b68267f8b2a	2026-08-26 13:11:47.169	2026-08-19 13:11:47.17	2026-08-19 13:11:47.17
cmt060m4s001iw7578iaz3ist	\N	019c29c6-a5fd-434b-8531-c78764cadbf1	2026-08-26 14:06:44.234	2026-08-19 14:06:44.236	2026-08-19 14:06:44.236
cmtiqbpm2000qbj3u2enjpy0u	cmr3f7hv6000433h2btxds1bx	\N	\N	2026-09-01 13:55:05.45	2026-09-01 13:55:05.45
cmtn2fb2j000hsa7e8s8irwnb	\N	31f46aec-ce25-4398-926b-66b35f4955a9	2026-09-11 14:44:53.32	2026-09-04 14:44:53.322	2026-09-04 14:44:53.322
cmtnzyxvy0000w7zdmcmxg0cb	\N	ac5b9169-117d-469b-8a65-c2f76e392db3	2026-09-12 06:23:56.685	2026-09-05 06:23:56.686	2026-09-05 06:23:56.686
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, parent_id, name, slug, description, image_url, sort_order, is_active, show_in_menu, created_at, description_en, name_en) FROM stdin;
cmr666e760003nvh1lh2oid89	\N	NOMA NO1	noma-no1	NOMA NO1	/uploads/products/1787145833381-52ybz9dh03x.png	0	t	t	2026-07-04 09:38:26.273	\N	\N
cmt04i7as0008w757pfyr88a8	\N	ROSSA	rossa	\N	/uploads/products/1787145864387-rztdrv2b4t7.jpeg	0	t	t	2026-08-19 13:24:25.588	\N	\N
cmt04ij370009w757hez58054	\N	TOTEM	totem	\N	/uploads/products/1787145879854-nol1wmjmr7.png	0	t	t	2026-08-19 13:24:40.867	\N	\N
\.


--
-- Data for Name: chatbot_rules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chatbot_rules (id, title, keywords, response, quick_replies, sort_order, is_active, created_at, updated_at) FROM stdin;
cmr3f7hvs000633h239mb9at8	Karşılama	{merhaba,selam,hi,hey,"iyi günler","iyi akşamlar",nasılsın}	Merhaba! 👋 Mağazamıza hoş geldiniz. Size nasıl yardımcı olabilirim?\n\nAşağıdaki konularda bilgi alabilirim:	{"Kargo & Teslimat","İade & İptal","Ürün & Stok","Ödeme Seçenekleri"}	1	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000733h275rzgwc3	Kargo & Teslimat	{kargo,teslimat,gönderim,"kaç günde","ne zaman gelir",takip}	🚚 **Kargo & Teslimat Bilgileri**\n\n• Siparişler 1–3 iş günü içinde kargoya verilir\n• Standart teslimat 2–4 iş günü sürer\n• 500₺ üzeri alışverişlerde kargo **ücretsiz!**\n• Kargo takibinizi Siparişlerim sayfasından yapabilirsiniz\n\nBaşka bir sorunuz var mı?	{"Siparişlerimi Göster","İade & İptal","Ana Sayfaya Dön"}	2	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000833h24q8c64ls	İade & İptal	{iade,iptal,geri,"para iadesi",değişim,bozuk,hasarlı,hatalı}	↩️ **İade & İptal Politikası**\n\n• Ürün tesliminden itibaren **14 gün** iade hakkınız var\n• Kullanılmamış ve orijinal ambalajında olması şarttır\n• İade talebinizi Siparişlerim sayfasından oluşturabilirsiniz\n• İadeler onaylandıktan sonra 5–7 iş günü içinde ödeme iade edilir\n\nDetaylı yardım için bize WhatsApp'tan ulaşabilirsiniz.	{"WhatsApp'a Bağlan","Siparişlerimi Göster","Diğer Konular"}	3	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000933h2ma9fs002	Ödeme Seçenekleri	{ödeme,"kredi kartı",havale,taksit,kapıda,eft,banka}	💳 **Ödeme Seçenekleri**\n\n• Tüm kredi ve banka kartları kabul edilir\n• 9 taksit imkânı (belirli kartlar)\n• Havale / EFT ile ödeme\n• Kapıda ödeme (nakit veya kart)\n\nGüvenli ödeme altyapısı için SSL koruması kullanılmaktadır. 🔒	{"Kargo Bilgileri","İade & İptal","Ürün Soruları"}	4	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000a33h2m3oqvxj5	Ürün & Stok	{ürün,stok,"var mı",mevcut,renk,beden,numara,model}	📦 **Ürün & Stok Bilgisi**\n\nBelirli bir ürün hakkında bilgi almak için:\n• Arama çubuğunu kullanabilirsiniz\n• Kategoriler üzerinden göz atabilirsiniz\n• Stok durumu ürün sayfasında görünmektedir\n\nBelirli bir ürünü mü arıyorsunuz? Ürün adını yazabilirsiniz! 🔍	{"Ürünleri Ara","WhatsApp'a Bağlan"}	5	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000b33h2xrqvjwcj	Sipariş Sorgulama	{sipariş,siparişim,nerede,durum,"takip et"}	📋 **Sipariş Sorgulama**\n\nSipariş durumunuzu görmek için:\n• Hesabınıza giriş yapın\n• 'Siparişlerim' sayfasını ziyaret edin\n• Her sipariş için kargo takip numarası mevcuttur\n\nGiriş yapmadan sipariş sorgulayamazsınız.	{"Siparişlerime Git","Kargo & Teslimat","Destek Al"}	6	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000c33h22dayz0ut	Hesap İşlemleri	{hesap,kayıt,üye,giriş,şifre,unuttum,profil}	👤 **Hesap İşlemleri**\n\n• **Kayıt olmak** için sağ üstteki 'Hesabım' butonuna tıklayın\n• **Şifrenizi** mi unuttunuz? Giriş sayfasındaki 'Şifremi Unuttum' linkini kullanın\n• Profil bilgilerinizi 'Hesabım → Profil' sayfasından güncelleyebilirsiniz	{"Giriş Yap","Kayıt Ol","Diğer Konular"}	7	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000d33h2bjgihyn1	İndirim & Kampanyalar	{indirim,kampanya,kupon,fırsat,promosyon,kod}	🎁 **İndirim & Kampanyalar**\n\n• Aktif kampanyaları ana sayfada görebilirsiniz\n• 500₺ üzeri siparişlerde ücretsiz kargo!\n• Yeni üyelere özel fırsatlar için bültenimize kayıt olun\n\nKupon kodunuzu sepet sayfasında uygulayabilirsiniz.	{"Kampanyaları Gör","Ürünleri İncele"}	8	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000e33h2ah2856j5	İletişim & Destek	{iletişim,telefon,email,mail,ulaş,yardım,destek,çözemedim,anlamadım}	📞 **Bize Ulaşın**\n\nSorunuz çözülmediyse bize doğrudan ulaşabilirsiniz:\n\n• 💬 **WhatsApp**: En hızlı yanıt\n• Hafta içi 09:00–18:00 aktif destek\n\nWhatsApp üzerinden devam edelim mi?	{"WhatsApp'a Bağlan","Sorunum Çözüldü ✓"}	9	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000f33h288xdcjnc	Teşekkür	{teşekkür,sağol,tamam,oldu,anladım,çözüldü}	Rica ederim! 😊 Başka bir sorunuz olursa buradayım.\n\nAlışverişlerinizde kolaylıklar dilerim! 🛍️	{"Ürünlere Göz At","Görüşürüz 👋"}	10	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
cmr3f7hvs000g33h2hmbikt7z	Varsayılan Yanıt (Fallback)	{}	Üzgünüm, bu konuda bilgim sınırlı. Size daha iyi yardımcı olabilmek için WhatsApp üzerinden bağlanmamı ister misiniz?	{"WhatsApp'a Bağlan","Kargo & Teslimat","İade & İptal","Ödeme Seçenekleri"}	99	t	2026-07-02 11:27:55.72	2026-07-02 11:27:55.72
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, user_id, email, name, subject, body, is_read, read_at, created_at) FROM stdin;
cmtlbw10v0004utrxdx5gv3bt	cmr3f7hv6000433h2btxds1bx	asd@asd.asd	asd	asd	asd	t	2026-09-03 09:34:26.68	2026-09-03 09:34:17.647
\.


--
-- Data for Name: discount_campaigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discount_campaigns (id, name, discount_text, end_date, show_on_home, color, display_type, cta_text, cta_link, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: discount_usages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discount_usages (id, discount_id, user_id, order_id, used_at) FROM stdin;
\.


--
-- Data for Name: discounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discounts (id, code, type, value, min_order, max_uses, used_count, is_active, expires_at, created_at, user_id, description, source_order_id) FROM stdin;
\.


--
-- Data for Name: feature_cards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.feature_cards (id, icon, title, description, sort_order, is_active, created_at, updated_at) FROM stdin;
cmr3f64gm000033h215ja7zjv	truck	Ücretsiz & Hızlı Kargo	750₺ üzeri alışverişlerinizde kargo bedava.	0	t	2026-07-02 11:26:51.668	2026-07-02 11:26:51.668
cmr3f64gn000133h2cfucctuq	rotate-ccw	14 Gün Kolay İade	Koşulsuz iade ve kolay değişim garantisi.	1	t	2026-07-02 11:26:51.668	2026-07-02 11:26:51.668
cmr3f64gn000233h2hhc0qdic	headphones	7/24 Canlı Destek	Sorularınız için her an yardıma hazırız.	2	t	2026-07-02 11:26:51.668	2026-07-02 11:26:51.668
cmr3f64gn000333h2pyci63qz	shield-check	Güvenli Ödeme Altyapısı	256-bit SSL ve İyzico güvencesiyle ödeyin.	3	t	2026-07-02 11:26:51.668	2026-07-02 11:26:51.668
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.invoices (id, order_id, type, status, ettn, belge_oid, invoice_no, profile, pdf_url, provider_response, error_message, sent_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: nav_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.nav_links (id, label, url, open_in_new_tab, sort_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.newsletter_subscribers (id, email, status, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, type, title, body, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: order_cancellations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_cancellations (id, order_id, status, reason, description, refund_amount, admin_notes, coupon_offered, coupon_code, coupon_value, requested_at, approved_at, refunded_at, rejected_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, variant_id, quantity, unit_price) FROM stdin;
cmr66bagv000pnvh1l0xq2uyk	cmr66bagn000nnvh1jf26tyyn	cmr6686gp0006nvh1g53s7pbs	1	1899.00
\.


--
-- Data for Name: order_return_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_return_items (id, return_id, order_item_id, quantity) FROM stdin;
\.


--
-- Data for Name: order_returns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_returns (id, order_id, user_id, status, reason, description, refund_amount, admin_notes, admin_user_id, requested_at, approved_at, rejected_at) FROM stdin;
\.


--
-- Data for Name: order_status_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_status_logs (id, order_id, status, note, created_at) FROM stdin;
cmr66bah7000rnvh1u2382gx2	cmr66bagn000nnvh1jf26tyyn	PENDING	Sipariş oluşturuldu	2026-07-04 09:42:14.731
cmt02tth40002w757kg8by1vl	cmr66bagn000nnvh1jf26tyyn	CANCELLED	\N	2026-08-19 12:37:28.312
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, address_id, status, subtotal, shipping_fee, discount, total, notes, created_at, updated_at, billing_name, identity_no, is_corporate, tax_number, tax_office) FROM stdin;
cmr66bagn000nnvh1jf26tyyn	cmr669iin000bnvh1unlp6u6b	cmr66a35f000knvh1k439hpav	CANCELLED	1899.00	0.00	0.00	1899.00	\N	2026-07-04 09:42:14.71	2026-08-19 12:37:28.304	\N	\N	f	\N	\N
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages (id, slug, title, content, show_in_menu, show_in_header, show_in_footer, sort_order, is_active, is_system, created_at, updated_at, content_en, title_en) FROM stdin;
cmr3f7hw2000k33h209r77ira	sozlesmeler	Şartlar & Politikalar	\n        <div class="space-y-6">\n          <h1 class="text-3xl font-extrabold text-white">Şartlar & Politikalar</h1>\n          <p class="text-slate-400">Onder Online web sitesini kullanarak aşağıdaki üyelik sözleşmesi, gizlilik politikası ve mesafeli satış sözleşmesi şartlarını kabul etmiş olursunuz.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">1. Gizlilik Politikası</h2>\n          <p class="text-slate-400 font-sans">Kişisel verileriniz KVKK kapsamında korunmakta ve üçüncü şahıslarla paylaşılmamaktadır.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">2. Mesafeli Satış Sözleşmesi</h2>\n          <p class="text-slate-400 font-sans">Satın alma işlemlerinde Tüketici Hakları Kanunu geçerlidir.</p>\n        </div>\n      	t	f	t	4	t	t	2026-07-02 11:27:55.73	2026-09-03 09:33:20.442	\N	\N
cmr3f7hw2000i33h2qild08c6	iade	Kolay İade & Değişim	\n        <div class="space-y-6">\n          <h1 class="text-3xl font-extrabold text-white">Kolay İade & Değişim</h1>\n          <p class="text-slate-400">Onder Online üzerinden satın aldığınız ürünleri, teslimat tarihinden itibaren 14 gün içerisinde ücretsiz olarak iade edebilir veya değiştirebilirsiniz.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">İade Koşulları</h2>\n          <ul class="list-disc pl-5 space-y-2 text-slate-400 font-sans">\n            <li>Ürünün orijinal ambalajı bozulmamış, kullanılmamış ve hasar görmemiş olmalıdır.</li>\n            <li>Tüm aksesuarları ve faturası ile birlikte gönderilmelidir.</li>\n            <li>Kişiselleştirilmiş ürünlerde iade yapılmamaktadır.</li>\n          </ul>\n        </div>\n      	t	f	t	2	t	t	2026-07-02 11:27:55.73	2026-09-03 09:33:22.775	\N	\N
cmr3f7hw2000n33h2p30qkey0	uyelik	Üyelik Sözleşmesi	\n        <div class="space-y-6">\n          <h1 class="text-3xl font-extrabold text-white">Üyelik Sözleşmesi</h1>\n          <p class="text-slate-400">Onder Online platformunda üyeliğiniz ile ilgili hak ve sorumlulukları açıklamak istiyoruz.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">1. Üyelik Şartları</h2>\n          <ul class="list-disc pl-5 space-y-2 text-slate-400 font-sans">\n            <li>18 yaşından büyük olmanız gerekir.</li>\n            <li>Gerçek kişi veya yasal tüzel kişi olmanız şarttır.</li>\n            <li>Sahte, yanıltıcı bilgi vermeniz yasaktır.</li>\n          </ul>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">2. Üyelik Hakkı</h2>\n          <p class="text-slate-400 font-sans">Üyelik iptal edilmesi durumunda sipariş verme, cari bakiye ve diğer hizmetlerden faydalanma hakkınız sona erer.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">3. Sorumluluklar</h2>\n          <p class="text-slate-400 font-sans">Şifrenizin gizliliğini sağlamaktan, verdiğiniz bilgilerin doğruluğundan ve hesabınızda yapılan işlemlerden siz sorumlusunuz.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">4. Kısıtlamalar</h2>\n          <p class="text-slate-400 font-sans">Platform herhangi bir nedenden dolayı hesabı kapatma veya kısıtlama hakkına sahiptir.</p>\n        </div>\n      	t	f	t	7	t	t	2026-07-02 11:27:55.73	2026-09-03 09:33:18.053	\N	\N
cmr3f7hw2000h33h2fpepv3np	iletisim	İletişim & Destek	\n      	t	f	t	1	t	t	2026-07-02 11:27:55.73	2026-09-03 09:30:00.302	\N	\N
cmr3f7hw2000m33h2khkpdol5	kvkk	KVKK Sözleşmesi	\n        <div class="space-y-6">\n          <h1 class="text-3xl font-extrabold text-white">KVKK Sözleşmesi (Gizlilik Politikası)</h1>\n          <p class="text-slate-400">6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, kişisel verilerinizin nasıl işlendiğini açıklamak istiyoruz.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">1. Veri Sahibinin Hakları</h2>\n          <p class="text-slate-400 font-sans">Kişisel verileriniz hakkında bilgi sahibi olmak, düzeltmesini isteyebilmek, silinmesini talep edebilmek gibi haklara sahipsiniz.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">2. Verilerin Kullanımı</h2>\n          <p class="text-slate-400 font-sans">Toplanan kişisel verileriniz, siparişlerinizi işlemek, kargo göndermek, müşteri hizmetleri sağlamak ve kanuni yükümlülükleri yerine getirmek amacıyla kullanılır.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">3. Veri Güvenliği</h2>\n          <p class="text-slate-400 font-sans">Verileriniz en modern şifreleme teknolojileri kullanılarak korunmakta ve üçüncü şahıslarla izinsiz paylaşılmamaktadır.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">4. İletişim</h2>\n          <p class="text-slate-400 font-sans">Veri konusunda sorularınız için: onder7@gmail.com adresine yazabilirsiniz.</p>\n        </div>\n      	t	f	t	6	t	t	2026-07-02 11:27:55.73	2026-09-03 09:33:18.749	\N	\N
cmr3f7hw2000j33h2jg3o49vd	sss	Sıkça Sorulan Sorular	\n        <div class="space-y-6">\n          <h1 class="text-3xl font-extrabold text-white">Sıkça Sorulan Sorular</h1>\n          <div class="space-y-4">\n            <div class="border-b border-slate-800 pb-4">\n              <h3 class="text-lg font-semibold text-white mb-1">Siparişim ne zaman kargoya verilir?</h3>\n              <p class="text-slate-400 font-sans">Hafta içi saat 15:00'e kadar verilen siparişler aynı gün kargoya verilir.</p>\n            </div>\n            <div class="border-b border-slate-800 pb-4">\n              <h3 class="text-lg font-semibold text-white mb-1">Kargo ücreti ne kadar?</h3>\n              <p class="text-slate-400 font-sans">500 TL ve üzeri alışverişlerinizde kargo ücretsizdir. Diğer siparişler için standart kargo ücreti 49.90 TL'dir.</p>\n            </div>\n            <div class="border-b border-slate-800 pb-4">\n              <h3 class="text-lg font-semibold text-white mb-1">Ödeme seçenekleriniz nelerdir?</h3>\n              <p class="text-slate-400 font-sans">Kredi kartı (iyzico / PayTR) ve kapıda nakit ödeme seçeneklerimiz mevcuttur.</p>\n            </div>\n          </div>\n        </div>\n      	t	f	t	3	t	t	2026-07-02 11:27:55.73	2026-09-03 09:33:02	\N	\N
cmr3f7hw2000l33h22tzbvidt	hakkimizda	Hakkımızda	\n        <div class="space-y-6">\n          <h1 class="text-3xl font-extrabold text-white">Hakkımızda</h1>\n          <p class="text-slate-400">Onder Online, kalite ve güvenirliliğin simgesidir. Kuruluşundan itibaren müşteri memnuniyetini ön planda tutarak hizmet vermekteyiz.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">Misyonumuz</h2>\n          <p class="text-slate-400 font-sans">En kaliteli ürünleri en uygun fiyatlarla sunarak, her müşterinin evini daha güzel ve konforlu bir yer haline getirmek.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">Vizyonumuz</h2>\n          <p class="text-slate-400 font-sans">Sektörde Türkiye'nin en güvenilir ve tercih edilen e-ticaret platformu olmak.</p>\n          <h2 class="text-xl font-bold text-white mt-6 mb-3">Değerlerimiz</h2>\n          <ul class="list-disc pl-5 space-y-2 text-slate-400 font-sans">\n            <li>Müşteri Memnuniyeti: Her zaman müşterinin ihtiyaçlarını ön planda tutuyor, hızlı ve kaliteli hizmet sunuyoruz.</li>\n            <li>Kalite: Ürünlerimiz en yüksek kalite standartlarını karşılamak üzere seçilmektedir.</li>\n            <li>Güvenilirlik: Tüm işlemlerde şeffaflık ve dürüstlüğü prensip ediyoruz.</li>\n            <li>İnovasyon: Teknoloji kullanarak müşteri deneyimini sürekli geliştiriyoruz.</li>\n          </ul>\n        </div>\n      	t	f	t	5	t	t	2026-07-02 11:27:55.73	2026-09-03 09:33:20.019	\N	\N
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, order_id, provider, amount, status, transaction_id, payload, created_at, updated_at) FROM stdin;
cmr66bai1000tnvh1mwvrc16n	cmr66bagn000nnvh1jf26tyyn	cod	1899.00	SUCCESS	COD_1783158134759	\N	2026-07-04 09:42:14.761	2026-07-04 10:05:54.979
\.


--
-- Data for Name: popup_notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.popup_notifications (id, title, content, image_url, button_text, button_link, is_active, display_freq, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: price_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_history (id, variant_id, old_price, new_price, admin_user_id, created_at) FROM stdin;
\.


--
-- Data for Name: product_answers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_answers (id, question_id, user_id, body, created_at) FROM stdin;
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, variant_id, url, alt_text, sort_order, is_primary) FROM stdin;
cmtn0mcmg0001sa7ej9aunlkr	cmt04yknz0015w757vqu3055y	\N	/uploads/products/1788268144597-9mi1t0arp6.jpg	\N	0	t
cmtn0mcmg0002sa7epwihwt0c	cmt04yknz0015w757vqu3055y	\N	/uploads/products/1788268144606-wwvnlqy4vv.jpg	\N	1	f
cmtn0mcmg0003sa7eddv5fixu	cmt04yknz0015w757vqu3055y	\N	/uploads/products/1788268144613-m4lonmi32p.jpg	\N	2	f
cmtn0mcmg0004sa7e5g7fp71h	cmt04yknz0015w757vqu3055y	\N	/uploads/products/1788268144627-wmidqn0jz0h.jpg	\N	3	f
cmtn0mcmg0005sa7ed8y9do0m	cmt04yknz0015w757vqu3055y	\N	/uploads/products/1788268144636-pnk4ceu8l4p.jpg	\N	4	f
cmtn0mth20007sa7erhctyce8	cmt04u83w000rw757f29pv278	\N	/uploads/products/1788268169377-cbte5a7lriw.jpg	\N	0	t
cmtn0mth20008sa7evm8wmbre	cmt04u83w000rw757f29pv278	\N	/uploads/products/1788268169382-02rcer2daz57.jpg	\N	1	f
cmtn0mth30009sa7ety99598h	cmt04u83w000rw757f29pv278	\N	/uploads/products/1788268169385-g157uw6sfc4.jpg	\N	2	f
cmtn0mth3000asa7ecc4el2kh	cmt04u83w000rw757f29pv278	\N	/uploads/products/1788268169392-aonbamktvz6.jpg	\N	3	f
cmtn0n3i4000csa7e8bxh778g	cmr6686go0005nvh1q7p3o7or	\N	/uploads/products/1788268192649-u3fzhkz8kxk.jpg	\N	0	t
cmtn0n3i4000dsa7elfbqflp7	cmr6686go0005nvh1q7p3o7or	\N	/uploads/products/1788268192655-o5z2ianenr.jpg	\N	1	f
cmtn0n3i4000esa7e9dwx1vt4	cmr6686go0005nvh1q7p3o7or	\N	/uploads/products/1788268192664-15lmjqkt4l5.jpg	\N	2	f
cmtn0n3i4000fsa7ea750teo7	cmr6686go0005nvh1q7p3o7or	\N	/uploads/products/1788268192672-yym2xd2l6us.jpg	\N	3	f
cmtn0n3i4000gsa7e3v57ggh9	cmr6686go0005nvh1q7p3o7or	\N	/uploads/products/1788268192659-2ht7yqn2hal.jpg	\N	4	f
\.


--
-- Data for Name: product_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_questions (id, product_id, user_id, guest_name, body, is_answered, is_approved, created_at) FROM stdin;
\.


--
-- Data for Name: product_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_tags (id, product_id, tag) FROM stdin;
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (id, product_id, sku, price, compare_at, stock_qty, desi, is_active, cost_price_override, markup_percentage_override, created_at) FROM stdin;
cmt04yko00016w7573xcbtjrz	cmt04yknz0015w757vqu3055y	totem-mavi	1000.00	0.01	100	\N	t	\N	\N	2026-08-19 13:37:09.406
cmt04u83w000sw757v17tx9js	cmt04u83w000rw757f29pv278	rossa-mavi	1000.00	\N	10	\N	t	\N	\N	2026-08-19 13:33:46.508
cmr6686gp0006nvh1g53s7pbs	cmr6686go0005nvh1q7p3o7or	terra-model-cift-kisilik-nevresim-takimi-mavi	1899.00	\N	100	\N	f	\N	\N	2026-07-04 09:39:49.559
cmt04nuoy000kw757y262wip6	cmr6686go0005nvh1q7p3o7or	noma-no1	1000.00	\N	0	\N	t	\N	\N	2026-08-19 13:28:49.186
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, category_id, brand_id, name, slug, description, is_active, is_featured, vat_rate, vat_included, pricing_method, cost_price, markup_percentage, created_at, updated_at, description_en, description_tr, name_en) FROM stdin;
cmr6686go0005nvh1q7p3o7or	cmr666e760003nvh1lh2oid89	\N	NOMA NO1	noma-no1	<p><strong style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);">NOMA NO1 – Masa Lambası / Aydınlatma</strong></p><p><br></p><p><span style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);">Geometrik zarafet ile el işçiliğinin buluştuğu NOMA NO1, mekanlarınıza hem modern hem de zamansız bir hava katmak için tasarlandı. Satranç tahtası desenli ahşap gövdesi ve kehribar tonlarındaki küre cam başlığıyla sadece bir aydınlatma değil, aynı zamanda iddialı bir dekoratif obje işlevi görür.</span></p><p><strong style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);">Öne Çıkan Özellikler</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);">Aşap Gövde:</strong><span style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);"> Doğal koyu ve açık ahşap blokların ustalıkla birleştirilmesiyle oluşturulan dama deseni.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);">El Yapımı Üfleme Cam:</strong><span style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);"> İçindeki doğal mermerimsi dokularla her açıdan benzersiz bir ışık süzülmesi sağlayan kehribar küre cam.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);">Pirinç Detaylar:</strong><span style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);"> Ahşap gövde ile cam başlığı estetikle buluşturan fırçalanmış pirinç bağlantı elemanı.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);">Sıcak ve Atmosferik Işık:</strong><span style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);"> Dinlendirici, yumuşak ve ambiyans odaklı bir aydınlatma deneyimi.</span></li></ol><p><br></p><p><strong style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);">Kullanım Alanları</strong></p><p><span style="background-color: rgba(0, 0, 0, 0); color: rgb(31, 31, 31);">Konsol üzeri, komodin, çalışma masası veya salonun odak noktalarında dekoratif köşe aydınlatması olarak kullanıma uygundur.</span></p><p><br></p>	t	f	20	t	fixed	\N	\N	2026-07-04 09:39:49.559	2026-09-04 13:54:57.511	<p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">TOTEM – Dual Lighting Set / Sculptural Table Lamps</strong></p><p><br></p><p><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">A rhythmic harmony of geometric forms and a bold union of contrasting colors: TOTEM. Designed with varying heights, colors, and form combinations, this dual set brings a sculptural elegance and an artistic atmosphere to your living spaces.</span></p><p><br></p><p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Key Features</strong></p><p><br></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Sculptural Dual Design:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> A striking visual balance crafted through the interplay of burgundy and black alongside olive green and terracotta glass spheres.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Interplay of Geometric Forms:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> A dynamic, architectural body structure created by stacking spherical, cylindrical, and domed elements.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Brass Details:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Brushed brass connection rings that create a refined transition between the matte surfaces and glass shades.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Versatile Functionality:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Display them together as a centerpiece duo or place them separately as standalone accent pieces in different corners of your space.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Warm Ambient Light:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Soft, relaxing lighting diffused through glossy glass spheres that creates an atmospheric, glare-free glow.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li></ol><p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Ideal Applications</strong></p><p><br></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Arranged as a paired display over large sideboards, credenzas, or mantelpieces.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Positioned as a bold decorative feature in architectural projects, hotel lobbies, or gallery spaces.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Used as a focal statement piece in modern, post-modern, and minimalist interior designs.</span></li></ol><p><br></p>	\N	\N
cmt04yknz0015w757vqu3055y	cmt04ij370009w757hez58054	\N	TOTEM	totem	<p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">TOTEM – İkili Aydınlatma Seti / Skulptürel Masa Lambaları</strong></p><p><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Geometrik formların ritmik uyumu ve zıt renklerin cesur birlikteliği: </span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">TOTEM</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">. Farklı yükseklik, renk ve form kombinasyonlarıyla tasarlanan bu ikili set, yaşam alanlarınıza heykelsi bir zarafet ve sanatsal bir atmosfer kazandırır.</span></p><p><br></p><h3><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Öne Çıkan Özellikler</span></h3><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Skulptürel İkili Tasarım:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Bordo ve siyahın, zeytin yeşili ve kiremit tonlarındaki küre camlarla oluşturduğu mükemmel görsel denge.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Geometrik Form İletişimi:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Küre, silindir ve kubbe elemanlarının üst üste kurgulandığı dinamik ve mimari gövde yapısı.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Pirinç Detaylar:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Mat yüzeylerle cam başlıklar arasında şık bir geçiş sağlayan fırçalanmış pirinç bağlantı bilezikleri.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Çok Yönlü Kullanım:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> İster birlikte odak noktası yaratan bir ikili (duo) olarak, ister mekânın farklı köşelerinde bağımsız birer aydınlatma objesi olarak sergileyin.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Sıcak Ambiyans Işığı:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Parlak cam kürelerin içerisinden süzülen, gözü yormayan dinlendirici ve atmosferik aydınlatma.</span></li></ol><p><br></p><h3><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Kullanım Alanları</span></h3><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Geniş konsol, büfe veya şömine üzerlerinde ikili kurgu olarak.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Mimari projelerde, otel lobilerinde veya galeri alanlarında iddialı dekoratif öge olarak.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Modern, post-modern ve minimalist iç mekân tasarımlarında odak noktası (statement piece) olarak.</span></li></ol><p><br></p>	t	t	20	t	fixed	\N	\N	2026-08-19 13:37:09.406	2026-09-04 13:54:22.672	<p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">TOTEM – Dual Lighting Set / Sculptural Table Lamps</strong></p><p><br></p><p><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">A rhythmic harmony of geometric forms and a bold union of contrasting colors: TOTEM. Designed with varying heights, colors, and form combinations, this dual set brings a sculptural elegance and an artistic atmosphere to your living spaces.</span></p><p><br></p><p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Key Features</strong></p><p><br></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Sculptural Dual Design:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> A striking visual balance crafted through the interplay of burgundy and black alongside olive green and terracotta glass spheres.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Interplay of Geometric Forms:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> A dynamic, architectural body structure created by stacking spherical, cylindrical, and domed elements.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Brass Details:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Brushed brass connection rings that create a refined transition between the matte surfaces and glass shades.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Versatile Functionality:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Display them together as a centerpiece duo or place them separately as standalone accent pieces in different corners of your space.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Warm Ambient Light:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Soft, relaxing lighting diffused through glossy glass spheres that creates an atmospheric, glare-free glow.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li></ol><p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Ideal Applications</strong></p><p><br></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Arranged as a paired display over large sideboards, credenzas, or mantelpieces.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Positioned as a bold decorative feature in architectural projects, hotel lobbies, or gallery spaces.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Used as a focal statement piece in modern, post-modern, and minimalist interior designs.</span></li></ol><p><br></p>	\N	\N
cmt04u83w000rw757f29pv278	cmt04i7as0008w757pfyr88a8	\N	ROSSA	rossa	<p><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Cesur formların ve sofistike renk paletinin mükemmel birleşimi: </span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">ROSSA</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">. Totem benzeri skulptürel yapısı, zengin bordo tonları ve tepe noktasındaki zeytin yeşili cam başlığıyla mekanlara hem sanatsal bir derinlik hem de karakteristik bir hava katar.</span></p><p><br></p><h3><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Öne Çıkan Özellikler</span></h3><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Skulptürel Geometrik Tasarım:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Silindir, küre ve kubbe formlarının dikey bir dengede üst üste dizilmesiyle oluşturulan özgün gövde mimarisi.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Mat Bordo Gövde:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Kadifemsi mat bordo yüzey kaplamasıyla mekanda iddialı ve sıcak bir duruş.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Zeytin Yeşili Cam Başlık:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Bordo gövdeyle kusursuz bir tezat oluşturan, sofistike zeytin yeşili parlak küre cam.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Pirinç Detay:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Cam başlığı gövdeye bağlayan, tasarıma şıklık katan fırçalanmış pirinç bilezik.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Ambiyans Aydınlatması:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Odak noktası yaratan yumuşak ve dinlendirici ışık yayılımı.</span></li></ol><p><br></p><h3><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Kullanım Alanları</span></h3><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Modern ve minimalist iç mekanlarda odak noktası (statement piece) olarak.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Konsol, yan sehpa veya geniş çalışma masalarının üzerinde.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Galeri, otel lobisi veya tasarım odaklı yaşam alanlarında dekoratif köşe aydınlatması olarak.</span></li></ol><p><br></p>	t	t	20	t	fixed	\N	\N	2026-08-19 13:33:46.508	2026-09-04 13:54:44.48	<p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">TOTEM – Dual Lighting Set / Sculptural Table Lamps</strong></p><p><br></p><p><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">A rhythmic harmony of geometric forms and a bold union of contrasting colors: TOTEM. Designed with varying heights, colors, and form combinations, this dual set brings a sculptural elegance and an artistic atmosphere to your living spaces.</span></p><p><br></p><p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Key Features</strong></p><p><br></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Sculptural Dual Design:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> A striking visual balance crafted through the interplay of burgundy and black alongside olive green and terracotta glass spheres.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Interplay of Geometric Forms:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> A dynamic, architectural body structure created by stacking spherical, cylindrical, and domed elements.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Brass Details:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Brushed brass connection rings that create a refined transition between the matte surfaces and glass shades.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Versatile Functionality:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Display them together as a centerpiece duo or place them separately as standalone accent pieces in different corners of your space.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Warm Ambient Light:</strong><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);"> Soft, relaxing lighting diffused through glossy glass spheres that creates an atmospheric, glare-free glow.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li></ol><p><strong style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Ideal Applications</strong></p><p><br></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Arranged as a paired display over large sideboards, credenzas, or mantelpieces.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Positioned as a bold decorative feature in architectural projects, hotel lobbies, or gallery spaces.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(31, 31, 31); background-color: rgba(0, 0, 0, 0);">Used as a focal statement piece in modern, post-modern, and minimalist interior designs.</span></li></ol><p><br></p>	\N	\N
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, product_id, user_id, rating, title, body, is_approved, created_at) FROM stdin;
\.


--
-- Data for Name: shippings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shippings (id, order_id, carrier, tracking_number, status, estimated_at, delivered_at, updated_at) FROM stdin;
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_settings (key, value, updated_at) FROM stdin;
setup_completed	true	2026-07-02 11:27:55.734
setup_completed_at	2026-07-02T11:27:55.733Z	2026-07-02 11:27:55.734
payment_cod_enabled	true	2026-07-04 09:42:04.307
payment_havale_enabled	false	2026-07-04 09:42:04.307
tax_rate	10	2026-07-04 09:42:49.801
general_store_name	VEY CONCEPT	2026-09-03 17:30:54.686
general_email	info@eyconcept.com	2026-09-03 17:30:54.686
general_phone	05551234567	2026-09-03 17:30:54.686
general_footer_slogan	Gündelik yaşamın içindeki objeleri ve mobilyaları yeni bir bakış açısıyla ele alan tasarım odaklı bir markadır.	2026-09-03 17:30:54.686
general_legal_name	VEY CONCEPT	2026-09-03 17:30:54.686
general_address	Antalya	2026-09-03 17:30:54.686
general_mapEmbed	https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d51034.16540271236!2d30.6642944!3d36.922982399999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1str!2str!4v1788427925849!5m2!1str!2str	2026-09-03 17:30:54.686
homepage_slides	[{"img":"/uploads/products/1788426202972-v6x61tu5rs.png","link":"/ara?search=yaz","title":"Başlık #1 ","buttonText":"Buton Metni","subtitle":"Alt Başlık"},{"img":"/uploads/products/1788426196179-9pjs7ubewfp.png","link":"/ara?search=yılbaşı","title":"Başlık #2","buttonText":"Buton Metni #2","subtitle":"Alt Başlık #2"},{"img":"/uploads/products/1788426199922-mpzbv3tjxs.png","link":"/ara?search=turuncu","title":"Başlık #3","buttonText":"Buton Metni #3","subtitle":"Alt Başlık #3"}]	2026-09-03 17:06:59.86
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_movements (id, variant_id, old_qty, new_qty, difference, reason, admin_user_id, note, created_at) FROM stdin;
cmt02tth90004w75720ekz91c	cmr6686gp0006nvh1g53s7pbs	99	100	1	order_cancelled	\N	\N	2026-08-19 12:37:28.317
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_profiles (id, user_id, first_name, last_name, phone, avatar_url, bio, avatar, oauth_ids, updated_at) FROM stdin;
cmr3f7hv6000533h2sjttcq3c	cmr3f7hv6000433h2btxds1bx	Onder	Monder	\N	\N	\N	\N	{}	2026-07-02 11:27:55.698
cmr669iio000cnvh1xdeyki71	cmr669iin000bnvh1unlp6u6b	onder	monder	05414113022	\N	\N	\N	{}	2026-07-04 09:40:51.838
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, password_hash, role, is_guest, is_active, refresh_tokens, marketing_consent, mfa_enabled, mfa_secret, backup_codes, created_at, updated_at, admin_note, sms_consent, terms_accepted_at) FROM stdin;
cmr669iin000bnvh1unlp6u6b	oakoz3366@gmail.com			\N	CUSTOMER	t	t	{}	f	f	\N	{}	2026-07-04 09:40:51.838	2026-07-04 09:40:51.838	\N	f	\N
cmr3f7hv6000433h2btxds1bx	onder7@gmail.com			$2b$12$qg5xRFQSLjmaBsg8NhxS4edTSkFlaps/KOWl2wzJ9Bw16Wry92vli	ADMIN	f	t	{}	f	f	\N	{}	2026-07-02 11:27:55.698	2026-09-01 13:03:45.6	\N	f	\N
\.


--
-- Data for Name: variant_attribute_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.variant_attribute_values (variant_id, attribute_value_id) FROM stdin;
cmr6686gp0006nvh1g53s7pbs	cmr665nf80002nvh18mo3rjdt
cmt04yko00016w7573xcbtjrz	cmr665nf80002nvh18mo3rjdt
cmt04u83w000sw757v17tx9js	cmr665nf80002nvh18mo3rjdt
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlist_items (id, wishlist_id, variant_id, added_at) FROM stdin;
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlists (id, user_id, name, created_at) FROM stdin;
cmr669imo000invh1rln5nlyl	cmr669iin000bnvh1unlp6u6b	Favorilerim	2026-07-04 09:40:51.984
\.


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: attribute_values attribute_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_values
    ADD CONSTRAINT attribute_values_pkey PRIMARY KEY (id);


--
-- Name: attributes attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: campaign_products campaign_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_products
    ADD CONSTRAINT campaign_products_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: chatbot_rules chatbot_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chatbot_rules
    ADD CONSTRAINT chatbot_rules_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: discount_campaigns discount_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_campaigns
    ADD CONSTRAINT discount_campaigns_pkey PRIMARY KEY (id);


--
-- Name: discount_usages discount_usages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_usages
    ADD CONSTRAINT discount_usages_pkey PRIMARY KEY (id);


--
-- Name: discounts discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT discounts_pkey PRIMARY KEY (id);


--
-- Name: feature_cards feature_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_cards
    ADD CONSTRAINT feature_cards_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: nav_links nav_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nav_links
    ADD CONSTRAINT nav_links_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_cancellations order_cancellations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_cancellations
    ADD CONSTRAINT order_cancellations_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_return_items order_return_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_return_items
    ADD CONSTRAINT order_return_items_pkey PRIMARY KEY (id);


--
-- Name: order_returns order_returns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_returns
    ADD CONSTRAINT order_returns_pkey PRIMARY KEY (id);


--
-- Name: order_status_logs order_status_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_logs
    ADD CONSTRAINT order_status_logs_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: popup_notifications popup_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.popup_notifications
    ADD CONSTRAINT popup_notifications_pkey PRIMARY KEY (id);


--
-- Name: price_history price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_pkey PRIMARY KEY (id);


--
-- Name: product_answers product_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_answers
    ADD CONSTRAINT product_answers_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_questions product_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_questions
    ADD CONSTRAINT product_questions_pkey PRIMARY KEY (id);


--
-- Name: product_tags product_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: shippings shippings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shippings
    ADD CONSTRAINT shippings_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (key);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: variant_attribute_values variant_attribute_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_pkey PRIMARY KEY (variant_id, attribute_value_id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: attribute_values_attribute_id_value_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX attribute_values_attribute_id_value_key ON public.attribute_values USING btree (attribute_id, value);


--
-- Name: attributes_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX attributes_name_key ON public.attributes USING btree (name);


--
-- Name: attributes_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX attributes_slug_key ON public.attributes USING btree (slug);


--
-- Name: brands_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX brands_slug_key ON public.brands USING btree (slug);


--
-- Name: campaign_products_campaign_id_product_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX campaign_products_campaign_id_product_id_key ON public.campaign_products USING btree (campaign_id, product_id);


--
-- Name: cart_items_cart_id_variant_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX cart_items_cart_id_variant_id_key ON public.cart_items USING btree (cart_id, variant_id);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: discounts_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX discounts_code_key ON public.discounts USING btree (code);


--
-- Name: invoices_ettn_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX invoices_ettn_key ON public.invoices USING btree (ettn);


--
-- Name: invoices_order_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX invoices_order_id_key ON public.invoices USING btree (order_id);


--
-- Name: newsletter_subscribers_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX newsletter_subscribers_email_key ON public.newsletter_subscribers USING btree (email);


--
-- Name: order_cancellations_order_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX order_cancellations_order_id_key ON public.order_cancellations USING btree (order_id);


--
-- Name: order_returns_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_returns_order_id_idx ON public.order_returns USING btree (order_id);


--
-- Name: pages_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pages_slug_key ON public.pages USING btree (slug);


--
-- Name: payments_order_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payments_order_id_key ON public.payments USING btree (order_id);


--
-- Name: price_history_variant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX price_history_variant_id_idx ON public.price_history USING btree (variant_id);


--
-- Name: product_tags_product_id_tag_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX product_tags_product_id_tag_key ON public.product_tags USING btree (product_id, tag);


--
-- Name: product_variants_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX product_variants_sku_key ON public.product_variants USING btree (sku);


--
-- Name: products_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);


--
-- Name: reviews_product_id_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX reviews_product_id_user_id_key ON public.reviews USING btree (product_id, user_id);


--
-- Name: shippings_order_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shippings_order_id_key ON public.shippings USING btree (order_id);


--
-- Name: stock_movements_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_movements_created_at_idx ON public.stock_movements USING btree (created_at);


--
-- Name: stock_movements_variant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_movements_variant_id_idx ON public.stock_movements USING btree (variant_id);


--
-- Name: user_profiles_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_profiles_user_id_key ON public.user_profiles USING btree (user_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: wishlist_items_wishlist_id_variant_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX wishlist_items_wishlist_id_variant_id_key ON public.wishlist_items USING btree (wishlist_id, variant_id);


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attribute_values attribute_values_attribute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_values
    ADD CONSTRAINT attribute_values_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES public.attributes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: campaign_products campaign_products_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_products
    ADD CONSTRAINT campaign_products_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: campaign_products campaign_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_products
    ADD CONSTRAINT campaign_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_items cart_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contact_messages contact_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: discount_usages discount_usages_discount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_usages
    ADD CONSTRAINT discount_usages_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: discount_usages discount_usages_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_usages
    ADD CONSTRAINT discount_usages_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: discount_usages discount_usages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_usages
    ADD CONSTRAINT discount_usages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: discounts discounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT discounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_cancellations order_cancellations_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_cancellations
    ADD CONSTRAINT order_cancellations_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_return_items order_return_items_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_return_items
    ADD CONSTRAINT order_return_items_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_return_items order_return_items_return_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_return_items
    ADD CONSTRAINT order_return_items_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.order_returns(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_returns order_returns_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_returns
    ADD CONSTRAINT order_returns_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_returns order_returns_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_returns
    ADD CONSTRAINT order_returns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_status_logs order_status_logs_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_logs
    ADD CONSTRAINT order_status_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: price_history price_history_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_answers product_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_answers
    ADD CONSTRAINT product_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.product_questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_answers product_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_answers
    ADD CONSTRAINT product_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_questions product_questions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_questions
    ADD CONSTRAINT product_questions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_questions product_questions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_questions
    ADD CONSTRAINT product_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_tags product_tags_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: products products_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: shippings shippings_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shippings
    ADD CONSTRAINT shippings_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: stock_movements stock_movements_admin_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_movements stock_movements_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: variant_attribute_values variant_attribute_values_attribute_value_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_attribute_value_id_fkey FOREIGN KEY (attribute_value_id) REFERENCES public.attribute_values(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: variant_attribute_values variant_attribute_values_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: wishlist_items wishlist_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: wishlist_items wishlist_items_wishlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_wishlist_id_fkey FOREIGN KEY (wishlist_id) REFERENCES public.wishlists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: wishlists wishlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict c5AYKiZHzbdzCVzeteoIhd6hPJLmoms0yJ3QmiUdhFNkcZs0Mawf8oPFuWUrXdi

