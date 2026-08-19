import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft } from 'lucide-react';
import API_BASE_URL from '../config';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Мэдээг авах
    fetch(`${API_BASE_URL}/api/news`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(item => item.id === parseInt(id));
        setNews(found);
        setOtherNews(data.filter(item => item.id !== parseInt(id)).slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="pt-40 pb-20 text-center">Уншиж байна...</div>;
  }

  if (!news) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-2xl font-black uppercase">Мэдээ олдсонгүй</h2>
        <Link to="/news" className="mt-8 inline-block text-toyota-red font-bold uppercase tracking-widest">
          Буцах
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-[120px] pb-20">
      <div className="container-custom">
        <Link
          to="/news"
          className="inline-flex items-center text-[10px] lg:text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-toyota-red transition-colors mb-6 lg:mb-10"
        >
          <ChevronLeft size={16} className="mr-1" />
          <span>Мэдээ рүү буцах</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 text-toyota-red mb-4 lg:mb-6">
            <Calendar size={14} className="lg:size-4" />
            <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">{news.date}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.1] mb-8 lg:mb-12">
            {news.title}
          </h1>

          <div className="w-full bg-zinc-100 mb-8 lg:mb-12 rounded-sm overflow-hidden shadow-sm aspect-video lg:aspect-auto">
            <img
              src={news.image || '/src/assets/placeholder.jpg'}
              alt={news.title}
              className="w-full h-full lg:h-auto object-cover lg:object-contain"
            />
          </div>

          <div
            className="text-zinc-700 lg:text-zinc-600 text-base lg:text-lg leading-relaxed whitespace-pre-wrap font-medium mb-12 lg:mb-20 px-1 lg:px-0"
          >
            {news.content}
          </div>

          {/* More News Section */}
          {otherNews.length > 0 && (
            <div className="border-t border-zinc-100 pt-12 lg:pt-20">
              <h2 className="text-xl lg:text-3xl font-black uppercase tracking-tight mb-8 lg:mb-12">Бусад <span className="text-toyota-red">мэдээлэл</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
                {otherNews.map((item) => (
                  <Link key={item.id} to={`/news/${item.id}`} className="group">
                    <div className="aspect-[4/3] lg:aspect-video overflow-hidden mb-3 lg:mb-4 bg-zinc-100 rounded-sm">
                      <img
                        src={item.image || '/src/assets/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h4 className="font-bold text-[10px] lg:text-sm uppercase tracking-tight group-hover:text-toyota-red transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsDetail;
