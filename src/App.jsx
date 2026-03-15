import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { COCKTAILS } from './data/cocktails';
import { storage, handleShare } from './utils/helpers';
import { useLocalStorage } from './hooks/useLocalStorage';

import BottomNav from './components/BottomNav';
import CocktailsTab from './components/CocktailsTab';
import CocktailDetail from './components/CocktailDetail';
import FavoritesTab from './components/FavoritesTab';
import MyBarTab from './components/MyBarTab';
import TechniquesTab from './components/TechniquesTab';
import HistoryTab from './components/HistoryTab';
import BatchCalculator from './components/BatchCalculator';
import CreateCocktailModal from './components/CreateCocktailModal';
import ImportModal from './components/ImportModal';
import RemixModal from './components/RemixModal';

export default function App() {
  const [tab, setTab] = useState("cocktails");
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [initialVariationIdx, setInitialVariationIdx] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedEra, setSelectedEra] = useState(null);

  // Persisted state
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [madeIt, setMadeIt] = useLocalStorage("madeIt", []);
  const [ratings, setRatings] = useLocalStorage("ratings", {});
  const [myBar, setMyBar] = useLocalStorage("myBar", []);
  const [barBrands, setBarBrands] = useLocalStorage("barBrands", {});
  const [customCocktails, setCustomCocktails] = useLocalStorage("customCocktails", []);
  const [customVariations, setCustomVariations] = useLocalStorage("customVariations", {});
  const [notes, setNotes] = useLocalStorage("notes", {});
  const [photos, setPhotos] = useLocalStorage("photos", {});
  const [customBottles, setCustomBottles] = useLocalStorage("customBottles", []);

  // Modal state
  const [batchCocktail, setBatchCocktail] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(null);

  // === FAVORITES (variation-level) ===
  // favorites is now an array of { cocktailId, variationIndex, variationName }
  const toggleFavorite = useCallback((cocktailId, variationIndex, variationName) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.cocktailId === cocktailId && f.variationIndex === variationIndex);
      if (exists) return prev.filter(f => !(f.cocktailId === cocktailId && f.variationIndex === variationIndex));
      return [...prev, { cocktailId, variationIndex, variationName }];
    });
  }, [setFavorites]);

  const isFavorite = useCallback((cocktailId, variationIndex) => {
    return favorites.some(f => f.cocktailId === cocktailId && f.variationIndex === variationIndex);
  }, [favorites]);

  // === MADE IT ===
  const toggleMadeIt = useCallback(id => {
    setMadeIt(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, [setMadeIt]);

  // === RATINGS ===
  const setRatingFn = useCallback((id, rating) => {
    setRatings(prev => ({ ...prev, [id]: rating }));
  }, [setRatings]);

  // === BAR INVENTORY ===
  const toggleBarItem = useCallback(ingredientId => {
    setMyBar(prev => prev.includes(ingredientId) ? prev.filter(x => x !== ingredientId) : [...prev, ingredientId]);
  }, [setMyBar]);

  // === CUSTOM BOTTLES ===
  const addCustomBottle = useCallback(bottle => {
    setCustomBottles(prev => {
      if (prev.find(b => b.id === bottle.id)) return prev;
      return [...prev, bottle];
    });
  }, [setCustomBottles]);

  const removeCustomBottle = useCallback(id => {
    setCustomBottles(prev => prev.filter(b => b.id !== id));
  }, [setCustomBottles]);

  // === NOTES ===
  const saveNote = useCallback((cocktailId, varName, text) => {
    setNotes(prev => ({ ...prev, [cocktailId + "::" + varName]: text }));
  }, [setNotes]);

  const getNote = useCallback((cocktailId, varName) => {
    return notes[cocktailId + "::" + varName] || "";
  }, [notes]);

  // === PHOTOS ===
  const savePhoto = useCallback((cocktailId, varName, dataUrl) => {
    setPhotos(prev => ({ ...prev, [cocktailId + "::" + varName]: dataUrl }));
  }, [setPhotos]);

  const getPhoto = useCallback((cocktailId, varName) => {
    return photos[cocktailId + "::" + varName] || null;
  }, [photos]);

  // === CUSTOM VARIATIONS ===
  const saveCustomVariation = useCallback((cocktailId, variation) => {
    setCustomVariations(prev => {
      const existing = prev[cocktailId] || [];
      return { ...prev, [cocktailId]: [...existing, variation] };
    });
  }, [setCustomVariations]);

  const deleteCustomVariation = useCallback((cocktailId, varName) => {
    setCustomVariations(prev => {
      const existing = prev[cocktailId] || [];
      return { ...prev, [cocktailId]: existing.filter(v => v.name !== varName) };
    });
  }, [setCustomVariations]);

  // === CUSTOM COCKTAILS ===
  const saveCustomCocktail = useCallback(cocktail => {
    setCustomCocktails(prev => [...prev, cocktail]);
  }, [setCustomCocktails]);

  const deleteCustomCocktail = useCallback(id => {
    setCustomCocktails(prev => prev.filter(c => c.id !== id));
  }, [setCustomCocktails]);

  // === MERGED COCKTAIL DATABASE ===
  const allCocktails = useMemo(() => {
    const merged = COCKTAILS.map(c => {
      const customVars = customVariations[c.id] || [];
      if (customVars.length === 0) return c;
      return { ...c, variations: [...c.variations, ...customVars] };
    });
    return [...merged, ...customCocktails];
  }, [customVariations, customCocktails]);

  const openCocktail = useCallback((cocktail, varIdx) => {
    const full = allCocktails.find(c => c.id === cocktail.id) || cocktail;
    setInitialVariationIdx(varIdx || 0);
    setSelectedCocktail(full);
  }, [allCocktails]);

  const handleTabChange = useCallback((newTab) => {
    setTab(newTab);
    setSelectedCocktail(null);
    setSelectedTechnique(null);
    setSelectedEra(null);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Good Spirits</h1>
        <div className="subtitle">The Home Mixologist{"\u2019"}s Bible</div>
      </header>

      <div className="app-content">
        {tab === "cocktails" && (
          <CocktailsTab
            cocktails={allCocktails}
            customCocktails={customCocktails}
            onSelect={openCocktail}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onShowCreate={() => setShowCreateModal(true)}
            onShowImport={() => setShowImportModal(true)}
          />
        )}
        {tab === "mybar" && (
          <MyBarTab
            myBar={myBar}
            barBrands={barBrands}
            toggleBarItem={toggleBarItem}
            setBarBrands={setBarBrands}
            onSelect={openCocktail}
            cocktails={allCocktails}
            customBottles={customBottles}
            addCustomBottle={addCustomBottle}
            removeCustomBottle={removeCustomBottle}
          />
        )}
        {tab === "techniques" && (
          <TechniquesTab
            selectedTechnique={selectedTechnique}
            setSelectedTechnique={setSelectedTechnique}
          />
        )}
        {tab === "history" && (
          <HistoryTab
            selectedEra={selectedEra}
            setSelectedEra={setSelectedEra}
            onSelectCocktail={openCocktail}
            cocktails={allCocktails}
          />
        )}
        {tab === "favorites" && (
          <FavoritesTab
            favorites={favorites}
            madeIt={madeIt}
            ratings={ratings}
            toggleFavorite={toggleFavorite}
            toggleMadeIt={toggleMadeIt}
            setRating={setRatingFn}
            onSelect={openCocktail}
            cocktails={allCocktails}
          />
        )}
      </div>

      <BottomNav activeTab={tab} onTabChange={handleTabChange} />

      {selectedCocktail && (
        <CocktailDetail
          cocktail={selectedCocktail}
          initialVariation={initialVariationIdx}
          onClose={() => setSelectedCocktail(null)}
          isFavorite={isFavorite(selectedCocktail.id, initialVariationIdx)}
          toggleFavorite={() => {
            const variation = selectedCocktail.variations[initialVariationIdx];
            toggleFavorite(selectedCocktail.id, initialVariationIdx, variation ? variation.name : "");
          }}
          isMadeIt={madeIt.includes(selectedCocktail.id)}
          toggleMadeIt={() => toggleMadeIt(selectedCocktail.id)}
          rating={ratings[selectedCocktail.id] || 0}
          setRating={r => setRatingFn(selectedCocktail.id, r)}
          onBatch={() => setBatchCocktail(selectedCocktail)}
          saveCustomVariation={v => saveCustomVariation(selectedCocktail.id, v)}
          deleteCustomVariation={name => deleteCustomVariation(selectedCocktail.id, name)}
          onRemix={v => setShowRemixModal({ cocktail: selectedCocktail, variation: v })}
          getNote={varName => getNote(selectedCocktail.id, varName)}
          saveNote={(varName, text) => saveNote(selectedCocktail.id, varName, text)}
          getPhoto={varName => getPhoto(selectedCocktail.id, varName)}
          savePhoto={(varName, dataUrl) => savePhoto(selectedCocktail.id, varName, dataUrl)}
          isCustom={selectedCocktail.isCustom}
          onDelete={selectedCocktail.isCustom ? () => { deleteCustomCocktail(selectedCocktail.id); setSelectedCocktail(null); } : null}
          onShare={variation => handleShare(selectedCocktail, variation, getPhoto(selectedCocktail.id, variation.name))}
        />
      )}

      {batchCocktail && (
        <BatchCalculator cocktail={batchCocktail} onClose={() => setBatchCocktail(null)} />
      )}

      {showCreateModal && (
        <CreateCocktailModal
          onClose={() => setShowCreateModal(false)}
          onSave={c => { saveCustomCocktail(c); setShowCreateModal(false); }}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onSave={c => { saveCustomCocktail(c); setShowImportModal(false); }}
        />
      )}

      {showRemixModal && (
        <RemixModal
          cocktail={showRemixModal.cocktail}
          variation={showRemixModal.variation}
          onClose={() => setShowRemixModal(null)}
          onSave={v => {
            saveCustomVariation(showRemixModal.cocktail.id, v);
            setShowRemixModal(null);
            setSelectedCocktail(prev => prev ? { ...prev, variations: [...prev.variations, v] } : prev);
          }}
        />
      )}
    </div>
  );
}
