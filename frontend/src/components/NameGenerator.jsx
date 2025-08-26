import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Copy, RefreshCw, Sparkles, Zap } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import axios from 'axios';

const NameGenerator = () => {
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState('');
  const [generatedNames, setGeneratedNames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Description requise",
        description: "Veuillez décrire votre app ou SaaS pour générer des noms.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockNames = getMockNames(description, industry, style);
      setGeneratedNames(mockNames);
      setIsGenerating(false);
      
      toast({
        title: "Noms générés !",
        description: `${mockNames.length} noms créés pour votre projet.`,
      });
    }, 2000);
  };

  const copyToClipboard = (name) => {
    navigator.clipboard.writeText(name);
    toast({
      title: "Copié !",
      description: `"${name}" a été copié dans le presse-papiers.`,
    });
  };

  const regenerate = () => {
    if (description.trim()) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-emerald-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NamaCraft
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Générez des noms modernes et uniques pour vos apps et SaaS. 
            Inspiré par les marques actuelles comme Clarq, Sage, Emma, Sonnie, Cluely...
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-5 w-5 text-emerald-600" />
              Décrivez votre projet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de votre app/SaaS *
              </label>
              <Textarea
                placeholder="Ex: Une app de gestion de tâches pour équipes, un SaaS de marketing automation, une plateforme de design collaboratif..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industrie (optionnel)
                </label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Choisir une industrie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technologie</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Santé</SelectItem>
                    <SelectItem value="education">Éducation</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="productivity">Productivité</SelectItem>
                    <SelectItem value="creative">Créatif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style (optionnel)
                </label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Choisir un style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Moderne</SelectItem>
                    <SelectItem value="minimalist">Minimaliste</SelectItem>
                    <SelectItem value="playful">Ludique</SelectItem>
                    <SelectItem value="professional">Professionnel</SelectItem>
                    <SelectItem value="creative">Créatif</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !description.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Générer des noms
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {generatedNames.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  Noms générés ({generatedNames.length})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={regenerate}
                  disabled={isGenerating}
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Régénérer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedNames.map((name, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => copyToClipboard(name)}
                  >
                    <span className="font-medium text-gray-800 text-lg">
                      {name}
                    </span>
                    <Copy className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-700 text-center">
                  💡 <strong>Astuce :</strong> Cliquez sur un nom pour le copier automatiquement !
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">
            Créé avec ❤️ pour générer des noms uniques et modernes
          </p>
        </div>
      </div>
    </div>
  );
};

export default NameGenerator;