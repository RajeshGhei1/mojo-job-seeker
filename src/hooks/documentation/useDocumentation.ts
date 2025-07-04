
import { useState } from 'react';
import { documentService, type DocumentContent } from '@/services/documentService';
import { getAllIntegratedDocuments } from '@/utils/documentTransformer';
import { atsDocuments } from '@/data/atsDocumentation';

export function useDocumentation() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const allDocuments = getAllIntegratedDocuments();

  const loadDocument = async (filePath: string) => {
    setLoading(true);
    try {
      // Check if it's an ATS document
      if (filePath.startsWith('ats-')) {
        const atsId = filePath.replace('ats-', '');
        const atsDoc = atsDocuments.find(d => d.id === atsId);
        if (atsDoc) {
          const documentContent: DocumentContent = {
            title: atsDoc.title,
            content: atsDoc.content,
            lastModified: atsDoc.lastUpdated,
            wordCount: atsDoc.content.split(' ').length
          };
          setSelectedDocument(documentContent);
        }
      } else {
        const doc = allDocuments.find(d => d.filePath === filePath);
        if (doc && doc.content) {
          const documentContent: DocumentContent = {
            title: doc.title,
            content: doc.content,
            lastModified: doc.lastModified,
            wordCount: doc.content.split(' ').length
          };
          setSelectedDocument(documentContent);
        } else {
          console.error('Document not found in available documents');
        }
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (filePath: string, title: string) => {
    try {
      let content = '';
      
      // Check if it's an ATS document
      if (filePath.startsWith('ats-')) {
        const atsId = filePath.replace('ats-', '');
        const atsDoc = atsDocuments.find(d => d.id === atsId);
        if (atsDoc) {
          content = atsDoc.content;
        }
      } else {
        const doc = allDocuments.find(d => d.filePath === filePath);
        if (doc && doc.content) {
          content = doc.content;
        }
      }

      if (content) {
        const filename = `${title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}.md`;
        
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Document content not found');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const downloadAllDocuments = async () => {
    try {
      for (const doc of allDocuments) {
        if (doc.content) {
          const filename = `${doc.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}.md`;
          
          const blob = new Blob([doc.content], { type: 'text/markdown' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          
          document.body.appendChild(link);
          link.click();
          
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error downloading all documents:', error);
    }
  };

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || doc.priority === selectedPriority;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || doc.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesType && matchesDifficulty;
  });

  return {
    selectedDocument,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedType,
    setSelectedType,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredDocuments,
    loadDocument,
    downloadDocument,
    downloadAllDocuments,
  };
}
