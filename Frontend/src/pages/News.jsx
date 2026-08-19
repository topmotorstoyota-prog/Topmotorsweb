import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news`)
      .then(res => res.json())
      .then(data => {
        setNewsList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="pt-40 pb-20 text-center font-bold">Уншиж байна...</div>;
  }

  return (
    <div className="pt-20 lg:pt-28 pb-20">
      <div className="container-custom px-4">
        <div className="mb-10 md:mb-16">
          <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mt-4 leading-none text-black">
            Мэдээ <span className="text-toyota-red">мэдээлэл</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
          {newsList.length > 0 ? (
            newsList.map((news, idx) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col h-full bg-white border border-zinc-100 hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/news/${news.id}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    <img
                      src={news.image || '/src/assets/placeholder.jpg'}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </Link>

                <div className="p-3 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4 text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="md:w-3.5 md:h-3.5" />
                      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider">{news.date}</span>
                    </div>
                  </div>

                  <Link to={`/news/${news.id}`}>
                    <h3 className="text-[11px] md:text-xl font-black uppercase tracking-tight mb-2 md:mb-4 group-hover:text-toyota-red transition-colors leading-tight line-clamp-2 h-7 md:h-auto">
                      {news.title}
                    </h3>
                  </Link>

                  <p className="hidden md:block text-zinc-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                    {news.excerpt}
                  </p>

                  <Link
                    to={`/news/${news.id}`}
                    className="mt-auto flex items-center text-[8px] md:text-xs font-black uppercase tracking-wider md:tracking-[0.2em] text-toyota-black group-hover:text-toyota-red transition-colors"
                  >
                    <span className="hidden sm:inline">Дэлгэрэнгүй унших</span>
                    <span className="sm:hidden">Дэлгэрэнгүй</span>
                    <ArrowRight size={12} className="ml-1 md:ml-2 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-zinc-400">Мэдээлэл одоогоор байхгүй байна.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
