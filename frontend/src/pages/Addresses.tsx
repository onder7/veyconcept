import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Trash2, Edit2, Plus, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

type AddressType = 'SHIPPING' | 'BILLING' | 'BOTH';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district?: string;
  neighborhood?: string;
  address: string;
  postalCode: string;
  type: AddressType;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  postalCode: string;
  isShipping: boolean;
  isBilling: boolean;
}

function buildEmptyForm(user?: { profile?: { firstName?: string; lastName?: string; phone?: string } | null }): FormData {
  return {
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    phone: user?.profile?.phone || '',
    city: '',
    district: '',
    neighborhood: '',
    address: '',
    postalCode: '',
    isShipping: true,
    isBilling: false,
  };
}

// Tip etiketleri
function TypeBadges({ type }: { type: AddressType }) {
  return (
    <div className="flex gap-2 flex-wrap mt-1">
      {(type === 'SHIPPING' || type === 'BOTH') && (
        <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
          📦 Gönderim Adresi
        </span>
      )}
      {(type === 'BILLING' || type === 'BOTH') && (
        <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
          💳 Fatura Adresi
        </span>
      )}
    </div>
  );
}

// Form state → API type dönüşümü
function toType(isShipping: boolean, isBilling: boolean): AddressType {
  if (isShipping && isBilling) return 'BOTH';
  if (isBilling) return 'BILLING';
  return 'SHIPPING';
}

// API type → Form state dönüşümü
function fromType(type: AddressType) {
  return {
    isShipping: type === 'SHIPPING' || type === 'BOTH',
    isBilling: type === 'BILLING' || type === 'BOTH',
  };
}

const inputClass =
  'w-full px-3 py-2 rounded-sm border border-border dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-amber-500 outline-none transition-colors';

const selectClass = inputClass + ' disabled:opacity-50 disabled:cursor-not-allowed';

export function Addresses() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [typeError, setTypeError] = useState('');
  const [saveError, setSaveError] = useState('');

  const [formData, setFormData] = useState<FormData>(() => buildEmptyForm(user ?? undefined));

  const { data: addresses = [], isLoading, refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await fetch('/api/addresses', { credentials: 'include' });
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
    },
  });

  // ─── İl / İlçe / Mahalle (kademeli) ─────────────────────────────────────────
  const { data: iller = [] } = useQuery<string[]>({
    queryKey: ['loc-iller'],
    queryFn: async () => {
      const res = await fetch('/api/locations/iller');
      if (!res.ok) return [];
      return (await res.json()).data || [];
    },
    staleTime: Infinity,
  });

  const { data: ilceler = [] } = useQuery<string[]>({
    queryKey: ['loc-ilceler', formData.city],
    queryFn: async () => {
      const res = await fetch(`/api/locations/ilceler?il=${encodeURIComponent(formData.city)}`);
      if (!res.ok) return [];
      return (await res.json()).data || [];
    },
    enabled: !!formData.city,
    staleTime: Infinity,
  });

  const { data: mahalleler = [] } = useQuery<string[]>({
    queryKey: ['loc-mahalleler', formData.city, formData.district],
    queryFn: async () => {
      const res = await fetch(
        `/api/locations/mahalleler?il=${encodeURIComponent(formData.city)}&ilce=${encodeURIComponent(formData.district)}`,
      );
      if (!res.ok) return [];
      return (await res.json()).data || [];
    },
    enabled: !!formData.city && !!formData.district,
    staleTime: Infinity,
  });

  async function handleSaveAddress() {
    setSaveError('');
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setSaveError('Ad ve soyadı zorunludur.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      setSaveError('Geçerli bir telefon numarası giriniz (en az 10 rakam).');
      return;
    }
    if (!formData.city || !formData.district) {
      setSaveError('İl ve ilçe seçimi zorunludur.');
      return;
    }
    if (!formData.address.trim() || formData.address.trim().length < 5) {
      setSaveError('Adres en az 5 karakter olmalıdır.');
      return;
    }
    if (!formData.isShipping && !formData.isBilling) {
      setTypeError('En az bir adres türü seçmelisiniz.');
      return;
    }
    setTypeError('');
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/addresses/${editingId}` : '/api/addresses';
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        city: formData.city,
        district: formData.district,
        neighborhood: formData.neighborhood,
        address: formData.address.trim(),
        postalCode: formData.postalCode.trim(),
        type: toType(formData.isShipping, formData.isBilling),
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || body?.error || 'Adres kaydedilemedi');
      }
      setFormData(buildEmptyForm(user ?? undefined));
      setIsAdding(false);
      setEditingId(null);
      refetch();
    } catch (err: any) {
      setSaveError(err.message || 'Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!window.confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Adres silinemedi');
      refetch();
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu');
    } finally {
      setDeleting(null);
    }
  }

  function openNew() {
    setEditingId(null);
    setFormData(buildEmptyForm(user ?? undefined));
    setTypeError('');
    setSaveError('');
    setIsAdding(true);
  }

  function openEdit(addr: Address) {
    setEditingId(addr.id);
    setFormData({
      firstName: addr.firstName,
      lastName: addr.lastName,
      phone: addr.phone,
      city: addr.city,
      district: addr.district || '',
      neighborhood: addr.neighborhood || '',
      address: addr.address,
      postalCode: addr.postalCode,
      ...fromType(addr.type),
    });
    setTypeError('');
    setSaveError('');
    setIsAdding(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/hesabim')} className="text-amber-800 dark:text-amber-500 hover:text-amber-600 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="font-display text-4xl text-foreground">{t('account.myAddresses')}</h1>
              <p className="text-gray-600 dark:text-gray-400">{t('account.manageAddresses')}</p>
            </div>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-background font-medium hover:bg-amber-900 transition-all"
          >
            <Plus size={20} />
            {t('account.addNewAddress')}
          </button>
        </div>

        {/* Address List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : addresses.length === 0 && !isAdding ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('account.noAddresses')}</p>
            <button onClick={openNew} className="inline-block text-amber-800 dark:text-amber-500 hover:underline font-medium">
              {t('account.addFirstAddress')} →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {addresses.map((addr: Address) => (
              <div key={addr.id} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {addr.firstName} {addr.lastName}
                    </h3>
                    <TypeBadges type={addr.type} />
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(addr)} className="text-muted-foreground hover:text-amber-700 transition-colors p-2">
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      disabled={deleting === addr.id}
                      className="text-gray-500 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">{addr.address}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {addr.neighborhood && `${addr.neighborhood}, `}
                    {addr.postalCode} {addr.district && `${addr.district} / `}{addr.city}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">📱 {addr.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="font-display text-3xl text-foreground mb-6">
              {editingId ? t('account.editAddress') : t('account.addNewAddress')}
            </h2>

            <div className="space-y-4">
              {/* Ad Soyadı */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.firstName')}</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.lastName')}</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className={inputClass} />
                </div>
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.phone')}</label>
                <input type="tel" placeholder="+90 5XX XXX XXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
              </div>

              {/* İl / İlçe / Mahalle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('account.city')}</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value, district: '', neighborhood: '' })}
                    className={selectClass}
                  >
                    <option value="">{t('common.select')}</option>
                    {iller.map((il) => <option key={il} value={il}>{il}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('account.district')}</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value, neighborhood: '' })}
                    disabled={!formData.city}
                    className={selectClass}
                  >
                    <option value="">{formData.city ? t('common.select') : t('account.selectCityFirst')}</option>
                    {ilceler.map((ilce) => <option key={ilce} value={ilce}>{ilce}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('account.neighborhood')}</label>
                  <select
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    disabled={!formData.district}
                    className={selectClass}
                  >
                    <option value="">{formData.district ? t('common.select') : t('account.selectDistrictFirst')}</option>
                    {mahalleler.map((mah) => <option key={mah} value={mah}>{mah}</option>)}
                  </select>
                </div>
              </div>

              {/* Açık Adres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('account.fullAddress')}</label>
                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} className={inputClass} />
              </div>

              {/* Posta Kodu */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('account.postalCode')}</label>
                  <input type="text" placeholder="34200" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} className={inputClass} />
                </div>
              </div>

              {/* Adres Türü — çoklu seçim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('account.addressType')} <span className="text-xs text-gray-400 font-normal">({t('account.multipleSelect')})</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  <label className={`flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-lg border-2 transition-all select-none ${
                    formData.isShipping
                      ? 'border-foreground bg-secondary dark:bg-secondary'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isShipping}
                      onChange={(e) => { setFormData({ ...formData, isShipping: e.target.checked }); setTypeError(''); }}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📦 {t('account.shippingAddress')}</span>
                  </label>
                  <label className={`flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-lg border-2 transition-all select-none ${
                    formData.isBilling
                      ? 'border-foreground bg-secondary dark:bg-secondary'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isBilling}
                      onChange={(e) => { setFormData({ ...formData, isBilling: e.target.checked }); setTypeError(''); }}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">💳 {t('account.billingAddress')}</span>
                  </label>
                </div>
                {typeError && <p className="text-xs text-red-500 mt-1.5">{typeError}</p>}
              </div>

              {/* Hata mesajı */}
              {saveError && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{saveError}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSaveAddress}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-foreground text-background font-medium rounded-full hover:bg-amber-900 disabled:opacity-50 transition-all"
                >
                  {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  onClick={() => { setIsAdding(false); setEditingId(null); setFormData(buildEmptyForm(user ?? undefined)); setTypeError(''); setSaveError(''); }}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
