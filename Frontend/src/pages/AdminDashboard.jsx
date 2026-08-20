import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2, Edit, Plus, X, Upload, LogOut, LayoutDashboard, Car,
  Newspaper, Box, Package, UserCircle, MessageSquare, Info, ChevronRight,
  ChevronDown, Settings, Fuel, Palette, SlidersHorizontal, Image as ImageIcon,
  Layers, PlusCircle, Phone, Mail, Calendar, Clock, MapPin, User, Star, Users, RotateCcw
} from 'lucide-react';
import API_BASE_URL from '../config';
import logo from '../assets/home/logo-1.png';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');

  useEffect(() => {
    if (!token) navigate('/admin-login');
    fetchData();
  }, [token, activeTab]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/${activeTab}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Устгахдаа итгэлтэй байна уу?')) return;
    await fetch(`${API_BASE_URL}/api/${activeTab}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  const tabIcons = {
    vehicles: <Car size={18} />,
    news: <Newspaper size={18} />,
    products: <Package size={18} />,
    'toyota-q': <LayoutDashboard size={18} />,
    'home-banner': <ImageIcon size={18} />,
    staff: <Users size={18} />,
    users: <UserCircle size={18} />,
    bookings: <MessageSquare size={18} />
  };

  const tabLabels = {
    vehicles: 'Загварууд',
    news: 'Мэдээ мэдээлэл',
    products: 'Бүтээгдэхүүн',
    'toyota-q': 'Toyota-Q',
    'home-banner': 'Нүүр хуудас',
    staff: 'Ажилчид',
    users: 'Хэрэглэгчид',
    bookings: 'Захиалга & Хүсэлт'
  };

  const tabs = ['vehicles', 'news', 'products', 'toyota-q', 'home-banner', 'staff', 'bookings'].filter(tab => {
    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') return true;
    if (tab === 'products') return permissions['wheels-tires'] || permissions.merch;
    return permissions[tab];
  });

  return (
    <div className="min-h-screen flex bg-[#f8f9fa] font-sans text-slate-900 text-sm">
      <div className="w-72 bg-black text-white flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-8 border-b border-zinc-800/50">
          <div className="flex items-center gap-3 text-white">
             <div className="w-10 h-10 bg-toyota-red flex items-center justify-center rounded-sm text-white">
                <img src={logo} className="w-6 invert brightness-0" alt="Logo" />
             </div>
             <div>
                <h1 className="text-lg font-black uppercase tracking-tighter leading-none">Toyota</h1>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Admin Panel</span>
             </div>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-1 mt-4 overflow-y-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setShowForm(false); setEditingItem(null); }} className={`flex items-center gap-3 w-full text-left p-4 rounded-sm font-bold transition-all ${activeTab === tab ? 'bg-toyota-red text-white' : 'text-zinc-400 hover:text-white'}`}>
              {tabIcons[tab]} <span className="uppercase tracking-widest text-[10px]">{tabLabels[tab]}</span>
            </button>
          ))}
          {userRole === 'SUPER_ADMIN' && (
            <button onClick={() => { setActiveTab('users'); setShowForm(false); setEditingItem(null); }} className={`flex items-center gap-3 w-full text-left p-4 rounded-sm font-bold mt-10 transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
              {tabIcons.users} <span className="uppercase tracking-widest text-[10px]">Хэрэглэгчид</span>
            </button>
          )}
        </nav>
        <div className="p-6 mt-auto"><button onClick={handleLogout} className="flex items-center gap-3 w-full p-4 text-zinc-500 hover:text-white transition-all"><LogOut size={18} /> <span className="uppercase tracking-widest text-[10px] font-bold">Гарах</span></button></div>
      </div>

      <div className="flex-1 ml-72">
        <header className="bg-white border-b h-24 flex items-center justify-between px-10 sticky top-0 z-10 shadow-sm">
           <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">{tabLabels[activeTab]} <span className="text-toyota-red">удирдах</span></h2>
           {!showForm && !editingItem && activeTab !== 'bookings' && <button onClick={() => { setShowForm(true); setEditingItem(null); }} className="bg-toyota-red text-white px-8 py-3.5 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-toyota-red/10"><Plus size={16} /> Шинэ нэмэх</button>}
        </header>

        <div className="p-10">
            {showForm || editingItem ? (
              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-sm shadow-xl border relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="h-1 bg-toyota-red w-full" />
                  <div className="p-8 md:p-12">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b">
                        <h3 className="text-xl font-black uppercase tracking-tight">{editingItem ? 'Засах' : 'Шинэ нэмэх'} <span className="text-toyota-red">{tabLabels[activeTab]}</span></h3>
                        <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
                    </div>
                    {activeTab === 'vehicles' ? (
                      <VehicleComplexForm key={editingItem?.id || 'new'} token={token} initialData={editingItem} onSuccess={() => { setShowForm(false); setEditingItem(null); fetchData(); }} />
                    ) : activeTab === 'users' ? (
                      <UserAdminForm key={editingItem?.id || 'new'} token={token} initialData={editingItem} onSuccess={() => { setShowForm(false); setEditingItem(null); fetchData(); }} />
                    ) : (
                      <AdminForm key={`${activeTab}-${editingItem?.id || 'new'}`} type={activeTab} token={token} userRole={userRole} permissions={permissions} initialData={editingItem} onSuccess={() => { setShowForm(false); setEditingItem(null); fetchData(); }} />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-sm border shadow-sm overflow-hidden">
                {activeTab === 'bookings' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 border-b">
                          <th className="p-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Төрөл</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Үйлчлүүлэгч</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Холбоо барих</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Захиалсан үе</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Ирсэн огноо</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Мэдээлэл</th>
                          <th className="p-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Үйлдэл</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length > 0 ? items.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-zinc-50 transition-colors">
                            <td className="p-5 px-8">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm inline-block w-fit ${
                                item.type === 'test_drive' ? 'bg-blue-100 text-blue-700' :
                                item.type === 'service' ? 'bg-orange-100 text-orange-700' :
                                item.type === 'new_car_order' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {item.type === 'test_drive' ? 'Жолоодлого' :
                                 item.type === 'service' ? 'Сервис' :
                                 item.type === 'new_car_order' ? 'Шинэ Машин Захиалга' :
                                 'Зурвас'}
                              </span>
                            </td>
                            <td className="p-5">
                              <p className="font-black uppercase text-[12px] text-slate-800">{item.name}</p>
                            </td>
                            <td className="p-5">
                              <div className="flex flex-col gap-1 text-[11px] font-bold">
                                <span className="text-slate-600">{item.phone}</span>
                                <span className="text-zinc-400">{item.email || '-'}</span>
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="flex flex-col text-[11px] font-bold text-zinc-600">
                                <span>{item.date}</span>
                                <span className="text-toyota-red">{item.time}</span>
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="text-[11px] font-bold text-zinc-400">
                                {item.createdAt ? new Date(item.createdAt).toLocaleString('mn-MN', {
                                  month: 'short',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '-'}
                              </span>
                            </td>
                            <td className="p-5">
                              <div className="max-w-xs">
                                {item.serviceType && (
                                  <p className="text-[10px] font-black uppercase text-toyota-red mb-1">
                                    {item.serviceType}
                                  </p>
                                )}
                                {(item.vehicle || item.plate) && (
                                  <p className="text-[10px] font-bold uppercase text-zinc-600 mb-1">
                                    {item.vehicle} {item.plate ? `(${item.plate})` : ''}
                                  </p>
                                )}
                                <p className="text-[11px] text-zinc-500 line-clamp-1 italic">{item.description || '-'}</p>
                              </div>
                            </td>
                            <td className="p-5 px-8 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setSelectedBooking(item)}
                                  className="w-10 h-10 flex items-center justify-center bg-zinc-100 text-slate-600 rounded-sm hover:bg-black hover:text-white transition-all"
                                  title="Харах"
                                >
                                  <Info size={16} />
                                </button>
                                <button
                                  onClick={() => setEditingItem(item)}
                                  className="w-10 h-10 flex items-center justify-center bg-zinc-100 text-slate-600 rounded-sm hover:bg-black hover:text-white transition-all"
                                  title="Засах"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="w-10 h-10 flex items-center justify-center bg-zinc-100 text-toyota-red rounded-sm hover:bg-toyota-red hover:text-white transition-all"
                                  title="Устгах"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan="5" className="p-20 text-center text-zinc-400 font-bold uppercase tracking-widest">Хүсэлт ирээгүй байна</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead><tr className="bg-zinc-50 border-b"><th className="p-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Мэдээлэл</th><th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Дэлгэрэнгүй</th><th className="p-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Үйлдэл</th></tr></thead>
                    <tbody>
                      {items.length > 0 ? items.map((item, idx) => (
                        <tr key={item.id} className={`border-b hover:bg-zinc-50 transition-colors ${idx % 2 === 0 ? '' : 'bg-white'}`}>
                          <td className="p-5 px-8">
                            <div className="flex items-center gap-5">
                              {item.image && <div className="w-14 h-14 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0 border"><img src={item.image} className="w-full h-full object-cover" /></div>}
                              <div>
                                <span className="font-black text-[13px] uppercase tracking-tight block text-slate-800">{activeTab === 'users' ? item.name : (item.name || item.title || item.question)}</span>
                                <div className="flex items-center gap-2">
                                  {activeTab === 'users' ? (
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.email}</span>
                                  ) : (
                                    <>
                                      {item.category && <span className="text-[10px] font-bold text-toyota-red uppercase tracking-widest">{item.category}</span>}
                                      {activeTab === 'vehicles' && item.isFeatured && (
                                        <span className="bg-yellow-100 text-yellow-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-sm flex items-center gap-1 ml-2">
                                          <Star size={10} fill="currentColor" /> Онцлох
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 text-center font-bold uppercase text-[11px] text-zinc-600">
                              {activeTab === 'users' ? (
                                <span className={`px-2 py-1 rounded-sm text-[9px] font-black ${
                                  item.role === 'SUPER_ADMIN' ? 'bg-black text-white' :
                                  item.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                                  'bg-zinc-100 text-zinc-600'
                                }`}>
                                  {item.role}
                                </span>
                              ) :
                               activeTab === 'toyota-q' ? `${item.year} / ${item.mileage} км` :
                               activeTab === 'news' ? item.date :
                               activeTab === 'products' ? (
                                 <div className="flex flex-col gap-1">
                                   <span>{item.price ? `₮${formatPriceDisplay(item.price)}` : '-'}</span>
                                   <span className={`text-[9px] px-2 py-0.5 rounded-full inline-block ${
                                     item.stock === 'Бэлэн байгаа' ? 'bg-green-100 text-green-700' :
                                     item.stock === 'Дууссан' ? 'bg-red-100 text-red-700' :
                                     'bg-blue-100 text-blue-700'
                                   }`}>
                                     {item.stock || 'Бэлэн байгаа'}
                                   </span>
                                 </div>
                               ) :
                               activeTab === 'home-banner' ? (
                                 <span className="text-zinc-400 font-medium">Үндсэн баннер</span>
                               ) :
                               (item.price ? `₮${formatPriceDisplay(item.price)}` : '-')}
                          </td>
                          <td className="p-5 px-8 text-right">
                            <div className="flex justify-end gap-2">
                               {activeTab !== 'home-banner' && (
                                 <button onClick={() => setEditingItem(item)} className="w-10 h-10 flex items-center justify-center bg-zinc-100 text-slate-600 rounded-sm hover:bg-black hover:text-white transition-all"><Edit size={16} /></button>
                               )}
                               {activeTab === 'home-banner' && (
                                 <button onClick={() => setEditingItem(item)} className="px-4 h-10 flex items-center justify-center bg-zinc-100 text-slate-600 rounded-sm hover:bg-black hover:text-white transition-all font-black uppercase text-[9px] tracking-widest gap-2"><Upload size={14}/> Солих</button>
                               )}
                               <button onClick={() => handleDelete(item.id)} className="w-10 h-10 flex items-center justify-center bg-zinc-100 text-toyota-red rounded-sm hover:bg-toyota-red hover:text-white transition-all"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={3} className="p-20 text-center">
                             <div className="max-w-xs mx-auto">
                                <ImageIcon size={40} className="mx-auto text-zinc-200 mb-4" />
                                <p className="text-zinc-400 font-bold uppercase tracking-widest mb-6">Одоогоор өгөгдөл алга</p>
                                {activeTab === 'home-banner' && (
                                  <button onClick={() => setShowForm(true)} className="w-full bg-toyota-red text-white py-3 font-black uppercase text-[10px] tracking-widest rounded-sm">Баннер хуулах</button>
                                )}
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-1.5 bg-toyota-red w-full" />
            <div className="p-8">
              <div className="flex justify-between items-center mb-8 pb-4 border-b">
                <h3 className="text-xl font-black uppercase tracking-tight">Захиалгын <span className="text-toyota-red">дэлгэрэнгүй</span></h3>
                <button onClick={() => setSelectedBooking(null)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Төрөл</label>
                  <p className="font-bold uppercase text-sm">
                    {selectedBooking.type === 'test_drive' ? 'Туршилтын жолоодлого' :
                     selectedBooking.type === 'service' ? 'Сервис захиалга' :
                     selectedBooking.type === 'new_car_order' ? 'Шинэ автомашины захиалга' :
                     'Зурвас / Хүсэлт'}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Төлөв</label>
                  <p className="font-black text-toyota-red uppercase text-sm">{selectedBooking.status}</p>
                </div>
                {selectedBooking.type === 'service' && selectedBooking.serviceType && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Үйлчилгээний төрөл</label>
                    <p className="font-bold text-toyota-red uppercase text-sm">{selectedBooking.serviceType}</p>
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Үйлчлүүлэгч</label>
                  <p className="font-bold uppercase text-sm">{selectedBooking.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Утас</label>
                  <p className="font-bold text-sm">{selectedBooking.phone}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Имэйл</label>
                  <p className="font-bold text-sm text-zinc-600">{selectedBooking.email || '-'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Ирсэн хугацаа</label>
                  <p className="font-bold text-sm text-zinc-500">
                    {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString('mn-MN') : '-'}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 p-6 rounded-sm space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Захиалсан огноо</label>
                    <p className="font-black text-toyota-red">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Захиалсан цаг</label>
                    <p className="font-black text-toyota-red">{selectedBooking.time}</p>
                  </div>
                </div>
                {selectedBooking.vehicle && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Сонирхсон загвар / Машин</label>
                    <p className="font-black uppercase">{selectedBooking.vehicle}</p>
                  </div>
                )}
                {selectedBooking.plate && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Улсын дугаар</label>
                    <p className="font-black uppercase">{selectedBooking.plate}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Зурвас / Нэмэлт тайлбар</label>
                {selectedBooking.type === 'new_car_order' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedBooking.description?.split('\n').map((line, i) => {
                      const [label, ...valueParts] = line.split(':');
                      const value = valueParts.join(':').trim();
                      if (!label || !value) return null;
                      return (
                        <div key={i} className="bg-zinc-50 p-4 border rounded-sm">
                          <label className="text-[9px] font-black uppercase text-toyota-red block mb-1">{label}</label>
                          <p className="font-bold text-xs text-slate-800">{value}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white border p-5 min-h-[100px] rounded-sm italic text-zinc-600 leading-relaxed text-sm">
                    {selectedBooking.description || 'Тайлбар байхгүй'}
                  </div>
                )}
              </div>

              <div className="mt-10">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-full bg-black text-white py-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-toyota-red transition-all"
                >
                  Хаах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const formatPriceDisplay = (price) => {
    if (!price) return '';
    let val = String(price).replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('en-US').format(val);
};

const handlePriceInput = (value) => {
    return value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function VehicleComplexForm({ token, initialData, onSuccess }) {
  // Өгөгдлийг цэвэрлэх (Cleanup) функц
  const cleanFeatures = (variantsJson) => {
    const variants = typeof variantsJson === 'string' ? JSON.parse(variantsJson || '[]') : (variantsJson || []);

    return variants.map(v => {
      const merged = {
        'INTERIOR': { category: 'INTERIOR', items: [] },
        'EXTERIOR': { category: 'EXTERIOR', items: [] },
        'SAFETY': { category: 'SAFETY', items: [] }
      };

      // Бүх хуучин үзүүлэлтүүдийг 3 ангилалд нэгтгэх
      (v.features || []).forEach(f => {
        const catName = f.category?.toUpperCase().trim();
        const targetCat = merged[catName] || merged['INTERIOR']; // Мэдэгдэхгүй бол Interior-т хийнэ

        (f.items || []).forEach(item => {
          // Давхардсан утга байгаа эсэхийг шалгах (Case insensitive)
          const exists = targetCat.items.find(i =>
            i.label?.toUpperCase() === item.label?.toUpperCase() &&
            i.value === item.value
          );
          if (!exists && item.label) {
            targetCat.items.push({
              label: item.label.toUpperCase().trim(),
              value: item.value
            });
          }
        });
      });

      return { ...v, features: Object.values(merged), interior360: v.interior360 || '' };
    });
  };

  const [formData, setFormData] = useState(initialData ? {
    ...initialData,
    isFeatured: initialData.isFeatured || false,
    colors: typeof initialData.colors === 'string' ? JSON.parse(initialData.colors || '[]') : (initialData.colors || []),
    variants: cleanFeatures(initialData.variants), // Энд шууд цэвэрлэж ачаална
    images: typeof initialData.images === 'string' ? JSON.parse(initialData.images || '[]') : (initialData.images || []),
    images360: typeof initialData.images360 === 'string' ? JSON.parse(initialData.images360 || '[]') : (initialData.images360 || [])
  } : { id: '', name: '', category: 'SUV', isFeatured: false, image: '', images: [], images360: [], description: '', colors: [], variants: [] });

  const [activeSubTab, setActiveTab] = useState('basic');

  const addFeatureCategory = (vIdx) => {
    const nv = [...formData.variants];
    if (!nv[vIdx].features) nv[vIdx].features = [];
    nv[vIdx].features.push({ category: '', items: [] });
    setFormData({ ...formData, variants: nv });
  };

  const addFeatureItem = (vIdx, catIdx) => {
    const nv = [...formData.variants];
    if (!nv[vIdx].features) {
      nv[vIdx].features = [
        { category: 'INTERIOR', items: [] },
        { category: 'EXTERIOR', items: [] },
        { category: 'SAFETY', items: [] }
      ];
    }
    nv[vIdx].features[catIdx].items.push({ label: '', value: '' });
    setFormData({ ...formData, variants: nv });
  };

  const handleFileChange = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: data });
      const result = await res.json();
      callback(result.imageUrl);
    } catch (err) { alert('Алдаа'); }
  };

  const handleMultipleFilesChange = async (e, callback) => {
    const files = Array.from(e.target.files).sort((a, b) => {
      return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});
    });

    if (files.length === 0) return;

    const uploadedUrls = [];

    for (const file of files) {
      const data = new FormData();
      data.append('image', file);

      try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: data
        });
        const result = await res.json();
        if (res.ok) {
          uploadedUrls.push(result.imageUrl);
        }
      } catch (err) {
        console.error('Error uploading file:', file.name, err);
      }
    }

    if (uploadedUrls.length > 0) {
      callback(uploadedUrls);
    } else {
      alert('Зураг хуулахад алдаа гарлаа');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = initialData ? 'PUT' : 'POST';
    const url = `${API_BASE_URL}/api/vehicles${initialData ? `/${initialData.id}` : ''}`;

    // Create clean body
    const body = {
      id: formData.id,
      name: formData.name,
      category: formData.category,
      isFeatured: formData.isFeatured || false,
      image: formData.image,
      description: formData.description,
      price: formData.price,
      images: JSON.stringify(formData.images || []),
      images360: JSON.stringify(formData.images360 || []),
      colors: JSON.stringify(formData.colors || []),
      variants: JSON.stringify(formData.variants || [])
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });

    if (res.ok) onSuccess();
    else {
      const errData = await res.json();
      alert('Алдаа: ' + (errData.message || 'Серверийн алдаа'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex border-b mb-8 font-black uppercase text-[10px] tracking-widest overflow-x-auto no-scrollbar">
        {[
          { id: 'basic', label: 'Үндсэн & Цомог', icon: <Info size={14}/> },
          { id: 'variants', label: 'Хувилбар & Үзүүлэлт', icon: <SlidersHorizontal size={14}/> }
        ].map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'border-toyota-red text-toyota-red bg-red-50/30' : 'border-transparent text-zinc-400'}`}>{tab.icon} {tab.label}</button>
        ))}
      </div>

      {activeSubTab === 'basic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">ID (Жишээ: lc300)</label><input value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} className="w-full p-4 bg-zinc-50 border rounded-sm" required disabled={!!initialData} /></div>
            <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Нэр</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-zinc-50 border rounded-sm" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Ангилал</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-4 bg-zinc-50 border rounded-sm"><option value="SUV">SUV</option><option value="Седан">Седан</option><option value="Пикап">Пикап</option><option value="VAN">VAN</option><option value="MPV">MPV</option></select></div>
            <div className="flex flex-col">
              <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Нүүр хуудас</label>
              <label className="flex items-center gap-3 cursor-pointer group p-[13px] bg-zinc-50 border rounded-sm h-full">
                <input
                  type="checkbox"
                  checked={formData.isFeatured || false}
                  onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 accent-toyota-red"
                />
                <span className="text-[10px] font-black uppercase text-zinc-600 group-hover:text-black transition-colors">Нүүр хуудсанд онцлох</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Үндсэн Зураг</label><div className="flex gap-2"><input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="flex-1 p-4 bg-zinc-50 border rounded-sm" /><label className="p-4 bg-black text-white rounded-sm cursor-pointer"><Upload size={18}/><input type="file" className="hidden" onChange={e => handleFileChange(e, url => setFormData({ ...formData, image: url }))} /></label></div></div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Глобал Цомог (Бүх хувилбарт харагдана)</label>
            <div className="grid grid-cols-5 gap-2">
                {(formData.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square border"><img src={img} className="w-full h-full object-cover" /><button type="button" onClick={() => { let imgs = [...formData.images]; imgs.splice(idx, 1); setFormData({ ...formData, images: imgs }); }} className="absolute top-1 right-1 bg-toyota-red text-white p-1 rounded-sm"><X size={10}/></button></div>
                ))}
                <label className="border-2 border-dashed flex items-center justify-center aspect-square cursor-pointer"><Plus size={16}/><input type="file" className="hidden" onChange={e => handleFileChange(e, url => setFormData({ ...formData, images: [...formData.images, url] }))} /></label>
            </div>
          </div>
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Тайлбар</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-zinc-50 border rounded-sm h-32" /></div>
        </div>
      )}

      {activeSubTab === 'features' && (
        <div className="space-y-8">
           <div className="bg-zinc-50 p-6 border rounded-sm">
             <div className="flex items-center justify-between mb-6">
                <h4 className="font-black uppercase text-xs tracking-widest text-toyota-red">Автомашины үзүүлэлтүүд</h4>
                <button type="button" onClick={addFeatureCategory} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-toyota-red transition-all">
                  <Plus size={14} /> Ангилал нэмэх
                </button>
             </div>

             <div className="space-y-6">
                {formData.features?.map((cat, catIdx) => (
                  <div key={catIdx} className="bg-white border-2 border-zinc-200 p-6 rounded-sm relative">
                    <button type="button" onClick={() => {
                      const nf = [...formData.features];
                      nf.splice(catIdx, 1);
                      setFormData({ ...formData, features: nf });
                    }} className="absolute top-4 right-4 text-zinc-300 hover:text-toyota-red"><Trash2 size={16}/></button>

                    <div className="mb-6">
                      <label className="block text-[9px] font-black uppercase text-zinc-400 mb-2">Ангиллын нэр (Жишээ: Interior, Safety)</label>
                      <input
                        value={cat.category}
                        onChange={e => {
                          const nf = [...formData.features];
                          nf[catIdx].category = e.target.value;
                          setFormData({ ...formData, features: nf });
                        }}
                        className="w-full md:w-1/2 p-3 bg-zinc-50 border rounded-sm font-black uppercase text-xs tracking-widest"
                        placeholder="Interior"
                      />
                    </div>

                    <div className="space-y-3">
                       {cat.items?.map((item, itemIdx) => (
                         <div key={itemIdx} className="flex gap-3 items-center">
                            <input
                              placeholder="Үзүүлэлт (Жишээ: Дэлгэц)"
                              value={item.label}
                              onChange={e => {
                                const nf = [...formData.features];
                                nf[catIdx].items[itemIdx].label = e.target.value;
                                setFormData({ ...formData, features: nf });
                              }}
                              className="flex-1 p-2.5 border bg-zinc-50 rounded-sm text-[11px] font-bold"
                            />
                            <input
                              placeholder="Утга (Жишээ: 12.3 инч)"
                              value={item.value}
                              onChange={e => {
                                const nf = [...formData.features];
                                nf[catIdx].items[itemIdx].value = e.target.value;
                                setFormData({ ...formData, features: nf });
                              }}
                              className="flex-1 p-2.5 border bg-white rounded-sm text-[11px] font-black text-toyota-red"
                            />
                            <button type="button" onClick={() => {
                              const nf = [...formData.features];
                              nf[catIdx].items.splice(itemIdx, 1);
                              setFormData({ ...formData, features: nf });
                            }} className="text-zinc-300 hover:text-toyota-red p-1"><X size={14}/></button>
                         </div>
                       ))}
                       <button type="button" onClick={() => addFeatureItem(catIdx)} className="w-full py-2 border-2 border-dashed border-zinc-100 text-zinc-400 font-bold uppercase text-[9px] hover:bg-zinc-50 hover:text-black transition-all">+ Үзүүлэлт нэмэх</button>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}

      {activeSubTab === 'variants' && (
        <div className="space-y-10">
           {formData.variants?.map((v, vIdx) => (
             <div key={vIdx} className="border-2 border-zinc-200 rounded-sm bg-white overflow-hidden shadow-sm">
                <div className="bg-zinc-900 text-white p-4 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <span className="font-black uppercase text-[10px] tracking-widest bg-toyota-red px-2 py-1">{v.engineType}</span>
                    <span className="font-black uppercase text-sm tracking-tight">{v.series || 'Шинэ хувилбар'}</span>
                  </div>
                  <button type="button" onClick={() => { let nv = [...formData.variants]; nv.splice(vIdx, 1); setFormData({ ...formData, variants: nv }); }} className="text-zinc-500 hover:text-white"><Trash2 size={18}/></button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Variant Basic Info */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Хөдөлгүүр</label>
                          <select value={v.engineType} onChange={e => { let nv = [...formData.variants]; nv[vIdx].engineType = e.target.value; setFormData({ ...formData, variants: nv }); }} className="w-full p-3 bg-zinc-50 border rounded-sm text-xs font-bold"><option value="Бензин">Бензин</option><option value="Дизель">Дизель</option><option value="Хайбрид">Хайбрид</option><option value="Цахилгаан">Цахилгаан</option></select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Загвар (Series: VX, ZX...)</label>
                          <input placeholder="Жишээ: VX" value={v.series} onChange={e => { let nv = [...formData.variants]; nv[vIdx].series = e.target.value; setFormData({ ...formData, variants: nv }); }} className="w-full p-3 bg-zinc-50 border rounded-sm text-xs font-bold" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Үнэ</label>
                          <input placeholder="Үнэ" value={v.price} onChange={e => { let nv = [...formData.variants]; nv[vIdx].price = handlePriceInput(e.target.value); setFormData({ ...formData, variants: nv }); }} className="w-full p-3 bg-zinc-50 border rounded-sm text-xs font-bold text-toyota-red" />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {[
                          { key: 'engine_spec', label: 'Engine (V6 3.5...)' },
                          { key: 'seats_spec', label: 'Seats (5, 7...)' },
                          { key: 'trans_spec', label: 'Trans (10AT...)' },
                          { key: 'drive_spec', label: 'Drive (4WD...)' },
                          { key: 'hp_spec', label: 'HP (Horsepower)' },
                          { key: 'torque_spec', label: 'Torque (Nm)' },
                          { key: 'fuel_spec', label: 'Fuel Cons (L/100km)' },
                          { key: 'extra_spec', label: 'Additional Spec' }
                        ].map(spec => (
                          <div key={spec.key}>
                             <label className="block text-[8px] font-black uppercase text-zinc-400 mb-1">{spec.label}</label>
                             <input
                               placeholder={spec.label}
                               value={v[spec.key] || ''}
                               onChange={e => {
                                 let nv = [...formData.variants];
                                 nv[vIdx][spec.key] = e.target.value;
                                 setFormData({ ...formData, variants: nv });
                               }}
                               className="w-full p-2 border rounded-sm text-[10px] font-bold"
                             />
                          </div>
                        ))}
                    </div>

                    <div>
                       <label className="block text-[9px] font-black uppercase text-zinc-400 mb-2">Хувилбарын тайлбар</label>
                       <textarea
                          value={v.description || ''}
                          onChange={e => { let nv = [...formData.variants]; nv[vIdx].description = e.target.value; setFormData({ ...formData, variants: nv }); }}
                          className="w-full p-4 bg-zinc-50 border rounded-sm h-32 text-xs"
                          placeholder="Энэ хувилбарын онцлог, давуу талуудыг энд бичнэ үү..."
                       />
                    </div>

                    {/* Variant Specific Gallery */}
                    <div className="border-t pt-8">
                       <h4 className="font-black uppercase text-[11px] mb-6 flex items-center gap-2 text-toyota-red"><ImageIcon size={14}/> Хувилбарын Цомог (Gallery)</h4>
                       <div className="grid grid-cols-6 gap-2">
                          {(v.images || []).map((img, imgIdx) => (
                            <div key={imgIdx} className="relative aspect-square border rounded-sm overflow-hidden group">
                               <img src={img} className="w-full h-full object-cover" />
                               <button type="button" onClick={() => { let nv = [...formData.variants]; nv[vIdx].images.splice(imgIdx, 1); setFormData({ ...formData, variants: nv }); }} className="absolute top-1 right-1 bg-toyota-red text-white p-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"><X size={10}/></button>
                            </div>
                          ))}
                          <label className="border-2 border-dashed border-zinc-200 flex items-center justify-center aspect-square cursor-pointer hover:border-toyota-red hover:bg-zinc-50 transition-all rounded-sm text-zinc-300">
                             <Plus size={20}/>
                             <input type="file" className="hidden" onChange={e => handleFileChange(e, url => {
                               let nv = [...formData.variants];
                               if(!nv[vIdx].images) nv[vIdx].images = [];
                               nv[vIdx].images.push(url);
                               setFormData({ ...formData, variants: nv });
                             })} />
                          </label>
                       </div>
                    </div>

                    {/* Salon Interior 360 Panorama */}
                    <div className="border-t pt-8">
                       <h4 className="font-black uppercase text-[11px] mb-6 flex items-center gap-2 text-toyota-red"><RotateCcw size={14}/> Салон 360° Панорама (Interior)</h4>
                       <div className="flex gap-4 items-end">
                          <div className="flex-1">
                             <label className="block text-[9px] font-black uppercase text-zinc-400 mb-2">Панорама зураг (Equirectangular format)</label>
                             <input value={v.interior360 || ''} onChange={e => { let nv = [...formData.variants]; nv[vIdx].interior360 = e.target.value; setFormData({ ...formData, variants: nv }); }} className="w-full p-4 bg-zinc-50 border rounded-sm text-xs" placeholder="Зургийн URL..." />
                          </div>
                          <label className="p-4 bg-black text-white rounded-sm cursor-pointer hover:bg-toyota-red transition-all">
                             <Upload size={18}/>
                             <input type="file" className="hidden" onChange={e => handleFileChange(e, url => {
                                let nv = [...formData.variants];
                                nv[vIdx].interior360 = url;
                                setFormData({ ...formData, variants: nv });
                             })} />
                          </label>
                       </div>
                       {v.interior360 && (
                         <div className="mt-4 aspect-video relative border rounded-sm overflow-hidden bg-zinc-100">
                            <img src={v.interior360} className="w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <span className="bg-black/60 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm">Панорама зураг сонгогдсон</span>
                            </div>
                            <button type="button" onClick={() => { let nv = [...formData.variants]; nv[vIdx].interior360 = ''; setFormData({ ...formData, variants: nv }); }} className="absolute top-2 right-2 bg-toyota-red text-white p-1 rounded-sm"><X size={14}/></button>
                         </div>
                       )}
                    </div>

                    {/* Colors within Variant */}
                    <div className="border-t pt-8">
                       <h4 className="font-black uppercase text-[11px] mb-6 flex items-center gap-2 text-toyota-red"><Palette size={14}/> Өнгөний сонголт болон 360°</h4>
                       <div className="space-y-6">
                          {(v.colors || []).map((color, cIdx) => (
                            <div key={cIdx} className="p-6 bg-zinc-50 border rounded-sm relative">
                               <button type="button" onClick={() => { let nv = [...formData.variants]; nv[vIdx].colors.splice(cIdx, 1); setFormData({ ...formData, variants: nv }); }} className="absolute top-4 right-4 text-zinc-300 hover:text-toyota-red"><X size={16}/></button>

                               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                  {/* Color Identity */}
                                  <div className="space-y-4">
                                     <div>
                                       <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Өнгөний нэр</label>
                                       <input placeholder="Нэр" value={color.name} onChange={e => { let nv = [...formData.variants]; nv[vIdx].colors[cIdx].name = e.target.value; setFormData({ ...formData, variants: nv }); }} className="w-full p-2 border bg-white rounded-sm text-[11px] font-bold" />
                                     </div>
                                     <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                          <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Код</label>
                                          <input type="color" value={color.hex} onChange={e => { let nv = [...formData.variants]; nv[vIdx].colors[cIdx].hex = e.target.value; setFormData({ ...formData, variants: nv }); }} className="w-full h-8 cursor-pointer border-none bg-transparent" />
                                        </div>
                                        <div className="w-16 h-16 border bg-white flex items-center justify-center relative rounded-sm">
                                          {color.image ? <img src={color.image} className="w-full h-full object-contain" /> : <div className="text-[8px] text-center text-zinc-400 uppercase font-bold">Зураг</div>}
                                          <label className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity"><Upload size={14} className="text-white"/><input type="file" className="hidden" onChange={e => handleFileChange(e, url => { let nv = [...formData.variants]; nv[vIdx].colors[cIdx].image = url; setFormData({ ...formData, variants: nv }); })} /></label>
                                        </div>
                                     </div>
                                  </div>

                                  {/* 360 Images for this specific Color */}
                                  <div className="md:col-span-3">
                                     <label className="block text-[9px] font-black uppercase text-zinc-400 mb-3">360° Эргэлттэй зургууд (16 ширхэг)</label>
                                     <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                        {(color.images360 || []).map((img360, i360Idx) => (
                                          <div key={i360Idx} className="relative aspect-square border bg-white rounded-sm group overflow-hidden">
                                            <img src={img360} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => { let nv = [...formData.variants]; nv[vIdx].colors[cIdx].images360.splice(i360Idx, 1); setFormData({ ...formData, variants: nv }); }} className="absolute top-1 right-1 bg-toyota-red text-white p-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"><X size={10}/></button>
                                          </div>
                                        ))}
                                        {(color.images360 || []).length < 24 && (
                                          <label className="border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-toyota-red hover:bg-white transition-all rounded-sm text-zinc-300">
                                            <Plus size={16}/>
                                            <span className="text-[8px] font-bold mt-1">Олноор</span>
                                            <input type="file" multiple className="hidden" onChange={e => handleMultipleFilesChange(e, urls => {
                                              let nv = [...formData.variants];
                                              if(!nv[vIdx].colors[cIdx].images360) nv[vIdx].colors[cIdx].images360 = [];
                                              nv[vIdx].colors[cIdx].images360 = [...nv[vIdx].colors[cIdx].images360, ...urls].slice(0, 24);
                                              setFormData({ ...formData, variants: nv });
                                            })} />
                                          </label>
                                        )}
                                     </div>
                                  </div>
                               </div>
                            </div>
                          ))}
                          <button type="button" onClick={() => {
                             let nv = [...formData.variants];
                             if(!nv[vIdx].colors) nv[vIdx].colors = [];
                             nv[vIdx].colors.push({ name: '', hex: '#ffffff', image: '', images360: [] });
                             setFormData({ ...formData, variants: nv });
                          }} className="w-full p-4 border-2 border-dashed border-zinc-200 text-zinc-400 font-black uppercase text-[10px] hover:bg-zinc-50 hover:text-toyota-red transition-all rounded-sm">Шинэ өнгө нэмэх</button>
                       </div>
                    </div>

                    {/* Variant Specific Features (UZUULELT) */}
                    <div className="border-t pt-8">
                       <h4 className="font-black uppercase text-[11px] mb-6 flex items-center gap-2 text-toyota-red"><Layers size={14}/> Тоноглол & Үзүүлэлтүүд</h4>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {['INTERIOR', 'EXTERIOR', 'SAFETY'].map((catName) => {
                            if (!v.features) v.features = [
                              { category: 'INTERIOR', items: [] },
                              { category: 'EXTERIOR', items: [] },
                              { category: 'SAFETY', items: [] }
                            ];
                            let currentCat = v.features.find(f => f.category === catName);
                            if (!currentCat) {
                              currentCat = { category: catName, items: [] };
                              v.features.push(currentCat);
                            }
                            const realIdx = v.features.indexOf(currentCat);

                            return (
                              <div key={catName} className="bg-zinc-50 border p-5 rounded-sm">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
                                   <span className="font-black text-[10px] text-toyota-black">{catName}</span>
                                   <button type="button" onClick={() => addFeatureItem(vIdx, realIdx)} className="text-toyota-red hover:text-black transition-colors">
                                      <PlusCircle size={16} />
                                   </button>
                                </div>
                                <div className="space-y-2">
                                  {(currentCat.items || []).map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex flex-col gap-1 p-2 bg-white border border-zinc-100 rounded-sm relative group">
                                       <input
                                         placeholder="Үзүүлэлт"
                                         value={item.label}
                                         onChange={e => {
                                           let nv = [...formData.variants];
                                           nv[vIdx].features[realIdx].items[itemIdx].label = e.target.value.toUpperCase();
                                           setFormData({ ...formData, variants: nv });
                                         }}
                                         className="w-full p-1 text-[9px] font-bold border-none focus:ring-0 uppercase"
                                       />
                                       <input
                                         placeholder="Утга"
                                         value={item.value}
                                         onChange={e => {
                                           let nv = [...formData.variants];
                                           nv[vIdx].features[realIdx].items[itemIdx].value = e.target.value;
                                           setFormData({ ...formData, variants: nv });
                                         }}
                                         className="w-full p-1 text-[10px] font-black text-toyota-red border-none focus:ring-0"
                                       />
                                       <button type="button" onClick={() => {
                                         let nv = [...formData.variants];
                                         nv[vIdx].features[realIdx].items.splice(itemIdx, 1);
                                         setFormData({ ...formData, variants: nv });
                                       }} className="absolute top-1 right-1 text-zinc-300 hover:text-toyota-red opacity-0 group-hover:opacity-100 transition-opacity">
                                         <X size={12}/>
                                       </button>
                                    </div>
                                  ))}
                                  {currentCat.items?.length === 0 && (
                                    <p className="text-[8px] text-zinc-400 italic text-center py-4">Мэдээлэл байхгүй</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                       </div>
                    </div>
                </div>
             </div>
           ))}
           <button type="button" onClick={() => setFormData({ ...formData, variants: [...(formData.variants || []), { series: '', engineType: 'Бензин', price: '', engine_spec: '', seats_spec: '', trans_spec: '', drive_spec: '', colors: [], interior360: '' }] })} className="w-full p-6 border-2 border-dashed border-toyota-red/20 text-toyota-red/40 font-black uppercase text-xs tracking-[0.4em] hover:bg-toyota-red/5 hover:text-toyota-red transition-all rounded-sm">Шинэ хувилбар нэмэх</button>
        </div>
      )}
      <button type="submit" className="w-full bg-black text-white py-6 rounded-sm font-black uppercase tracking-[0.6em] text-sm hover:bg-toyota-red transition-all shadow-2xl shadow-black/10">Мэдээллийг хадгалах</button>
    </form>
  );
}

function AdminForm({ type, token, userRole, permissions = {}, initialData, onSuccess }) {
  const canManageWheelsTires = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || permissions['wheels-tires'];
  const canManageMerch = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || permissions.merch;
  const [formData, setFormData] = useState(initialData ? {
    ...initialData,
    images: typeof initialData.images === 'string' ? JSON.parse(initialData.images || '[]') : (initialData.images || [])
  } : { stock: 'Бэлэн байгаа', images: [] });
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const handleFileChange = async (e, isGallery = false) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: data });
      const result = await res.json();
      if (isGallery) {
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), result.imageUrl] }));
      } else {
        setFormData(prev => ({ ...prev, image: result.imageUrl }));
      }
    } catch (err) { alert('Алдаа'); }
    setUploading(false);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPdf(true);
    const data = new FormData();
    data.append('pdf', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload-pdf`, { method: 'POST', body: data });
      const result = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, serviceHistory: result.pdfUrl }));
      } else {
        alert(result.message || 'PDF хуулахад алдаа гарлаа');
      }
    } catch (err) {
      alert('PDF хуулахад алдаа гарлаа');
    }
    setUploadingPdf(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = initialData ? 'PUT' : 'POST';
    const url = `${API_BASE_URL}/api/${type}${initialData ? `/${initialData.id}` : ''}`;
    let body = { ...formData };

    // Stringify images array
    if (Array.isArray(body.images)) {
      body.images = JSON.stringify(body.images);
    }

    // ЧУХАЛ: Тухайн моделоос хамаарч хэрэггүй талбаруудыг устгах
    if (method === 'POST') {
        delete body.id;
    }

    if (initialData) { delete body.id; delete body.updatedAt; delete body.createdAt; }
    if (type === 'news') {
        delete body.stock;
        delete body.price;
        delete body.category;
    }
    if (type === 'vehicles') {
        delete body.stock;
    }
    if (type === 'bookings') {
        delete body.stock;
        delete body.category;
        delete body.price;
        delete body.images;
        delete body.image;
    }
    if (type === 'toyota-q') {
        delete body.stock;
        delete body.category;
    } else if (type === 'staff') {
        delete body.stock;
        delete body.category;
        delete body.price;
        delete body.images;
        delete body.description;
    } else if (type === 'home-banner') {
        delete body.stock;
        delete body.category;
        delete body.price;
        delete body.images;
        delete body.description;
        delete body.name;
    } else if (type === 'products') {
        // Keep stock, category, price, and images
    } else {
        delete body.images;
    }

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
    if (res.ok) onSuccess(); else { let d = await res.json(); alert(d.message || 'Алдаа гарлаа'); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (type === 'bookings') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Төрөл</label>
            <select name="type" value={formData.type || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold">
              <option value="test_drive">Жолоодлого</option>
              <option value="service">Сервис</option>
              <option value="message">Зурвас</option>
            </select>
          </div>
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Төлөв (Status)</label>
            <select name="status" value={formData.status || 'Шинэ'} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold text-toyota-red">
              <option value="Шинэ">Шинэ</option>
              <option value="Хүлээгдэж буй">Хүлээгдэж буй</option>
              <option value="Баталгаажсан">Баталгаажсан</option>
              <option value="Цуцлагдсан">Цуцлагдсан</option>
              <option value="Дууссан">Дууссан</option>
            </select>
          </div>
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Нэр</label><input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" required /></div>
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Утас</label><input name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" required /></div>
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Имэйл</label><input name="email" value={formData.email || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" /></div>
          {formData.type === 'service' && (
            <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Үйлчилгээний төрөл</label><input name="serviceType" value={formData.serviceType || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold text-toyota-red" /></div>
          )}
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Огноо</label><input name="date" value={formData.date || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" /></div>
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Цаг</label><input name="time" value={formData.time || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" /></div>
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Машин / Загвар</label><input name="vehicle" value={formData.vehicle || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" /></div>
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Улсын дугаар</label><input name="plate" value={formData.plate || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" /></div>
        </div>
        <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Тайлбар</label><textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm h-32 resize-none" /></div>
        <button type="submit" className="w-full bg-black text-white py-5 rounded-sm font-black uppercase tracking-[0.4em] text-xs hover:bg-toyota-red transition-all">Захиалга хадгалах</button>
      </form>
    );
  }

  if (type === 'news') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed p-10 text-center relative group">
          {formData.image ? <img src={formData.image} className="h-40 mx-auto object-cover" /> : <div className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest"><Upload className="mx-auto mb-2" />{uploading ? 'Уншиж байна...' : 'Зураг сонгох'}</div>}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
        </div>
        <div className="space-y-4">
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Мэдээний гарчиг</label><input name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold text-lg" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Огноо</label><input name="date" type="date" value={formData.date || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" /></div>
            <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Товч агуулга</label><input name="excerpt" value={formData.excerpt || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm" placeholder="Жагсаалтад харагдах текст..." /></div>
          </div>
          <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Үндсэн мэдээлэл</label><textarea name="content" value={formData.content || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm h-64 resize-none font-medium leading-relaxed" required /></div>
        </div>
        <button type="submit" className="w-full bg-black text-white py-5 rounded-sm font-black uppercase tracking-[0.4em] text-xs hover:bg-toyota-red transition-all">Мэдээ хадгалах</button>
      </form>
    );
  }

  if (type === 'home-banner') {
    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-zinc-50 p-10 border-2 border-dashed rounded-sm text-center relative group min-h-[300px] flex flex-col items-center justify-center">
          {formData.image ? (
            <div className="relative w-full max-w-2xl">
              <img src={formData.image} className="w-full h-64 object-cover rounded-sm shadow-lg" alt="Banner Preview" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                 <span className="text-white font-black uppercase text-xs tracking-widest">Зураг солих</span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
              <ImageIcon className="mx-auto mb-4" size={48} />
              {uploading ? 'Уншиж байна...' : 'Баннер зураг сонгох'}
            </div>
          )}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, false)} />
        </div>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-xs">
           <p className="font-bold mb-1">Зөвлөмж:</p>
           <p>Баннер зургийн хэмжээ 1920x800 эсвэл түүнээс дээш, өндөр чанартай байхыг анхаарна уу.</p>
        </div>
        <button type="submit" className="w-full bg-black text-white py-5 rounded-sm font-black uppercase tracking-[0.4em] text-xs hover:bg-toyota-red transition-all">
          Баннер хадгалах
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-2 border-dashed p-10 text-center relative group">
        {formData.image ? <img src={formData.image} className="h-32 mx-auto" /> : <div className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest"><Upload className="mx-auto mb-2" />{uploading ? 'Уншиж байна...' : 'Үндсэн зураг сонгох'}</div>}
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, false)} />
      </div>

      {(type === 'toyota-q' || type === 'products') && (
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase text-zinc-400">Зургийн цомог (Gallery)</label>
          <div className="grid grid-cols-5 gap-2">
            {(formData.images || []).map((img, idx) => (
              <div key={idx} className="relative aspect-square border bg-zinc-50 rounded-sm overflow-hidden">
                <img src={img} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    const newImgs = [...formData.images];
                    newImgs.splice(idx, 1);
                    setFormData({ ...formData, images: newImgs });
                  }}
                  className="absolute top-1 right-1 bg-toyota-red text-white p-1 rounded-sm shadow-md"
                >
                  <X size={10}/>
                </button>
              </div>
            ))}
            <label className="border-2 border-dashed flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-zinc-50 transition-colors rounded-sm text-zinc-400">
              <Plus size={20}/>
              <span className="text-[8px] font-bold uppercase mt-1">Нэмэх</span>
              <input type="file" className="hidden" onChange={(e) => handleFileChange(e, true)} />
            </label>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <label className="block text-[10px] font-black uppercase text-zinc-400">Нэр</label>
        <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" required />

        <div className="grid grid-cols-2 gap-4">
            {type !== 'toyota-q' && type !== 'users' && type !== 'staff' && (
              <>
                <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Ангилал</label>{type === 'products' ? <select name="category" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold"><option value="">Сонгох</option>{canManageWheelsTires && <option value="Обуд">Обуд</option>}{canManageWheelsTires && <option value="Дугуй">Дугуй</option>}{canManageMerch && <option value="GR Merch">GR Merch</option>}</select> : <input name="category" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" />}</div>
                <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Үлдэгдэл / Төлөв</label>
                  <select name="stock" value={formData.stock || 'Бэлэн байгаа'} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold">
                    <option value="Бэлэн байгаа">Бэлэн байгаа</option>
                    <option value="Дууссан">Дууссан</option>
                    <option value="Ирж байгаа">Ирж байгаа</option>
                    <option value="Захиалгаар">Захиалгаар</option>
                  </select>
                </div>
              </>
            )}
            {type !== 'users' && type !== 'staff' && (
                <div className={type === 'toyota-q' ? 'col-span-2' : ''}>
                  <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Үнэ</label>
                  <input name="price" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: handlePriceInput(e.target.value) })} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold text-toyota-red" />
                </div>
            )}
            {type === 'staff' && (
               <>
                 <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Албан тушаал</label><input name="position" value={formData.position || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" required /></div>
                 <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Утас</label><input name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" required /></div>
               </>
            )}
        </div>

        {type === 'products' && (
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">
              {formData.category === 'Дугуй' ? 'Дугуйны хэмжээ (Size) - Олон бол зай эсвэл таслалаар тусгаарлаарай' :
               formData.category === 'Обуд' ? 'Радиус (R) - Жишээ нь: R18' :
               'Хэмжээ (Size) - Олон бол зай эсвэл таслалаар тусгаарлаарай'}
            </label>
            <input name="size" value={formData.size || ''} onChange={handleChange} placeholder={formData.category === 'Обуд' ? "Жишээ: R17 R18" : "Жишээ: 265/65R17 285/50R20"} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" />
          </div>
        )}

        {type === 'toyota-q' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Огноо (Year)</label><input name="year" value={formData.year || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm" /></div>
                <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Гүйлт (Mileage)</label><input name="mileage" value={formData.mileage || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm" /></div>
                <div><label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Мотор (Engine)</label><input name="engine" value={formData.engine || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm" /></div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Моторын төрөл</label>
                  <select name="engineType" value={formData.engineType || 'Бензин'} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold">
                    <option value="Бензин">Бензин</option>
                    <option value="Дизель">Дизель</option>
                    <option value="Хайбрид">Хайбрид</option>
                    <option value="Цахилгаан">Цахилгаан</option>
                  </select>
                </div>
            </div>
        )}

        {type === 'toyota-q' && (
          <div className="p-6 bg-zinc-50 border rounded-sm">
            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-4">Засварын түүх (PDF)</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.serviceHistory || ''}
                  readOnly
                  placeholder="PDF файл хуулаагүй байна"
                  className="w-full p-4 bg-white border rounded-sm text-xs italic"
                />
              </div>
              <label className="bg-black text-white px-6 py-4 rounded-sm font-bold uppercase text-[10px] tracking-widest cursor-pointer hover:bg-toyota-red transition-all flex items-center gap-2 shrink-0">
                <Upload size={16} />
                {uploadingPdf ? 'Хуулж байна...' : 'PDF Хуулах'}
                <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
              </label>
              {formData.serviceHistory && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, serviceHistory: '' })}
                  className="text-toyota-red font-bold text-[10px] uppercase tracking-widest hover:underline"
                >
                  Устгах
                </button>
              )}
            </div>
          </div>
        )}

        <textarea name="description" placeholder="Тайлбар..." value={formData.description || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm h-32 resize-none font-medium" />
      </div>
      <button type="submit" className="w-full bg-black text-white py-5 rounded-sm font-black uppercase tracking-[0.4em] text-xs hover:bg-toyota-red transition-all">Хадгалах</button>
    </form>
  );
}

function UserAdminForm({ token, initialData, onSuccess }) {
  const [formData, setFormData] = useState(initialData ? {
    ...initialData,
    password: '' // Don't show password
  } : {
    email: '',
    name: '',
    password: '',
    role: 'EDITOR',
    canManageVehicles: false,
    canManageNews: false,
    canManageWheelsTires: false,
    canManageMerch: false,
    canManageToyotaQ: false,
    canManageBookings: false,
    canManageHomeBanner: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = initialData ? 'PUT' : 'POST';
    const url = `${API_BASE_URL}/api/users${initialData ? `/${initialData.id}` : ''}`;

    let body = { ...formData };
    if (method === 'POST') {
      delete body.id;
    }
    if (initialData && !body.password) {
      delete body.password; // Don't update password if empty
    }
    if (initialData) {
      delete body.id;
      delete body.createdAt;
      delete body.updatedAt;
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });

    if (res.ok) onSuccess();
    else {
      const errData = await res.json();
      alert('Алдаа: ' + (errData.message || 'Серверийн алдаа'));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const permissionFields = [
    { name: 'canManageVehicles', label: 'Загварууд удирдах' },
    { name: 'canManageNews', label: 'Мэдээ удирдах' },
    { name: 'canManageWheelsTires', label: 'Дугуй, Обуд удирдах' },
    { name: 'canManageMerch', label: 'GR Merch удирдах' },
    { name: 'canManageToyotaQ', label: 'Toyota-Q удирдах' },
    { name: 'canManageBookings', label: 'Захиалга удирдах' },
    { name: 'canManageHomeBanner', label: 'Нүүр хуудасны баннер удирдах' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Имэйл</label>
          <input name="email" value={formData.email} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" required />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Нэр</label>
          <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold" required />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Нууц үг {initialData && '(Өөрчлөхгүй бол хоосон орхино уу)'}</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm" required={!initialData} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2">Эрх (Role)</label>
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-4 bg-zinc-50 border rounded-sm font-bold">
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="EDITOR">EDITOR</option>
          </select>
        </div>
      </div>

      {formData.role === 'EDITOR' && (
        <div className="p-6 bg-zinc-50 border rounded-sm">
          <label className="block text-[10px] font-black uppercase text-zinc-400 mb-4">EDITOR-ийн зөвшөөрлүүд</label>
          <div className="grid grid-cols-2 gap-4">
            {permissionFields.map(field => (
              <label key={field.name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name]}
                  onChange={handleChange}
                  className="w-5 h-5 accent-toyota-red"
                />
                <span className="text-[11px] font-bold uppercase text-zinc-600 group-hover:text-black transition-colors">{field.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button type="submit" className="w-full bg-black text-white py-5 rounded-sm font-black uppercase tracking-[0.4em] text-xs hover:bg-toyota-red transition-all">
        Хэрэглэгчийг хадгалах
      </button>
    </form>
  );
}
