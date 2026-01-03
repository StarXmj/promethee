import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import annalesData from '../../data/annales.json';
import TermsAgreement from './TermsAgreement';
import FilterBar from './FilterBar';
import StatusHeader from './StatusHeader';
import GridView from './GridView';
import ListView from './ListView';
import Pagination from './Pagination';
import BetaBadge from '../BetaBadge';

export default function SearchPortal() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedMatieres, setSelectedMatieres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSemestres, setSelectedSemestres] = useState([]);
  const [sortOrder, setSortOrder] = useState('year_desc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const RESULTS_PER_PAGE = 48;

  const processedData = useMemo(() => annalesData.map(item => ({
    ...item,
    timestamp: new Date(item.scraped_at.split(' ').reverse().join(' ')).getTime()
  })), []);

  const fuse = useMemo(() => new Fuse(processedData, { keys: ['title', 'category'], threshold: 0.3 }), [processedData]);

  const searchBase = useMemo(() => {
    return query ? fuse.search(query).map(r => r.item) : processedData;
  }, [query, fuse, processedData]);

  // FACETTES DYNAMIQUES : Les options s'adaptent aux autres filtres
  const dynamicMatieres = useMemo(() => {
    let list = searchBase;
    if (selectedYears.length > 0) list = list.filter(a => a.année && selectedYears.includes(a.année.toString()));
    if (selectedSemestres.length > 0) list = list.filter(a => a.semestre && selectedSemestres.includes(a.semestre.toString()));
    return [...new Set(list.map(a => a.matière).filter(Boolean))].sort();
  }, [searchBase, selectedYears, selectedSemestres]);

  const dynamicYears = useMemo(() => {
    let list = searchBase;
    if (selectedMatieres.length > 0) list = list.filter(a => a.matière && selectedMatieres.includes(a.matière));
    if (selectedSemestres.length > 0) list = list.filter(a => a.semestre && selectedSemestres.includes(a.semestre.toString()));
    return [...new Set(list.map(a => a.année).filter(a => a != null))].sort((a,b) => b-a);
  }, [searchBase, selectedMatieres, selectedSemestres]);

  const filteredResults = useMemo(() => {
    let list = searchBase;
    if (selectedMatieres.length > 0) list = list.filter(a => selectedMatieres.includes(a.matière));
    if (selectedYears.length > 0) list = list.filter(a => a.année && selectedYears.includes(a.année.toString()));
    if (selectedSemestres.length > 0) list = list.filter(a => a.semestre && selectedSemestres.includes(a.semestre.toString()));
    return [...list].sort((a, b) => sortOrder === 'year_desc' ? (b.année || 0) - (a.année || 0) : (a.année || 0) - (b.année || 0));
  }, [searchBase, selectedMatieres, selectedYears, selectedSemestres, sortOrder]);

  const getHighlightClass = (cat) => {
    const cu = cat.toUpperCase();
    if (selectedYears.some(y => cu.includes(y))) return "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg";
    if (selectedSemestres.length > 0 && (cu.includes("S1") || cu.includes("S2"))) return "bg-rose-500/20 border-rose-400 text-rose-300 shadow-lg";
    if (selectedMatieres.some(m => cu.includes(m.toUpperCase()))) return "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg";
    return "bg-[#D4AF37]/5 border-[#D4AF37]/10 text-[#D4AF37]/60";
  };

  if (!isAgreed) return <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4"><TermsAgreement onAccept={() => setIsAgreed(true)} /></div>;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10 md:py-20 text-center">
      <header className="mb-12">
        <h1 className="text-5xl md:text-9xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] mb-4">PROMÉTHÉE</h1>
        <p className="text-[#D4AF37]/60 font-cinzel tracking-widest text-xs md:text-sm mb-6">PORTAIL ACADÉMIQUE — UPPA</p>
        <BetaBadge />
      </header>

      <FilterBar 
        query={query} setQuery={setQuery} setIsSearching={setIsSearching}
        selectedMatieres={selectedMatieres} setSelectedMatieres={setSelectedMatieres} matieres={dynamicMatieres}
        selectedYears={selectedYears} setSelectedYears={setSelectedYears} availableYears={dynamicYears}
        selectedSemestres={selectedSemestres} setSelectedSemestres={setSelectedSemestres}
        sortOrder={sortOrder} setSortOrder={setSortOrder}
      />

      <StatusHeader totalResults={filteredResults.length} isSearching={isSearching} viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === 'grid' 
        ? <GridView results={filteredResults.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE)} getHighlightClass={getHighlightClass} /> 
        : <ListView results={filteredResults.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE)} getHighlightClass={getHighlightClass} />}

      <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredResults.length / RESULTS_PER_PAGE)} goToPage={(p) => {setCurrentPage(p); window.scrollTo({top: 0, behavior: 'smooth'})}} />
    </div>
  );
}