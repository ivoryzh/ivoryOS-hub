import React, { useState } from 'react';
import { Cpu, Zap, Download, Wifi, Usb, CheckCircle, AlertCircle, Settings, Play, ChevronRight, Search, Plus, Trash2, FileText, Code } from 'lucide-react';

const IvoryOSMarketplace = () => {
  const [selectedHardware, setSelectedHardware] = useState([]);
  const [selectedOptimizers, setSelectedOptimizers] = useState([]);
  const [connections, setConnections] = useState({});
  const [step, setStep] = useState('hardware');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [downloadType, setDownloadType] = useState('bash');
  const [showMainPreview, setShowMainPreview] = useState(false);
  const [copiedMain, setCopiedMain] = useState(false);

  const hardwareOptions = [
    {
      id: 'ika-hotplate',
      name: 'IKA Hotplate Stirrer',
      category: 'Heating & Stirring',
      vendor: 'IKA',
      connection: ['usb'],
      icon: '🌡️',
      specs: 'RCT digital, RS232',
      difficulty: 'beginner',
      package: 'ika',
      path: 'ika.magnetic_stirrer',
      module: 'MagneticStirrer'
    },
    {
      id: 'ika-vacuum',
      name: 'IKA Vacuum Pump',
      category: 'Vacuum Systems',
      vendor: 'IKA',
      connection: ['usb', 'network'],
      icon: '🔄',
      specs: 'RV 10, RS232/Ethernet control',
      difficulty: 'beginner',
      package: 'ika',
      path: 'ika.vacuum_pump',
      module: 'VacuumPump'
    },
    {
      id: 'new-era-pump',
      name: 'New Era Syringe Pump',
      category: 'Fluid Handling',
      vendor: 'New Era',
      connection: ['usb'],
      icon: '💉',
      specs: 'NE-1000, RS232 control',
      difficulty: 'beginner',
      package: 'new-era',
      path: 'new_era.peristaltic_pump_network',
      module: 'PeristalticPumpNetwork'
    },
    // {
    //   id: 'mt-balance',
    //   name: 'Mettler Toledo Balance',
    //   category: 'Weighing',
    //   vendor: 'Mettler Toledo',
    //   connection: ['usb', 'network'],
    //   icon: '⚖️',
    //   specs: 'XPE/XSE series, MT-SICS',
    //   difficulty: 'intermediate',
    //   package: 'ivoryos-mettler'
    // },
    {
      id: 'sielc-autosampler',
      name: 'SIELC Autosampler',
      category: 'Sampling',
      vendor: 'SIELC',
      connection: ['usb', 'network'],
      icon: '🧪',
      specs: 'AS-1 Series, serial interface',
      difficulty: 'intermediate',
      package: 'sielc-dompser',
      path: 'sielc_dompser.autosampler.autosampler',
      module: 'Autosampler'
    },
    {
      id: 'vici-valve',
      name: 'VICI Switching Valve',
      category: 'Fluid Routing',
      vendor: 'VICI Valco',
      connection: ['usb', 'network'],
      icon: '🔀',
      specs: 'Multiposition valves, TTL/serial',
      difficulty: 'intermediate',
      package: 'vicivalve',
      path: 'vicivalve',
      module: 'VICI'
    },
    {
      id: 'vapourtec-sf10',
      name: 'Vapourtec SF-10',
      category: 'Flow Chemistry',
      vendor: 'Vapourtec',
      connection: ['usb', 'network'],
      icon: '⚗️',
      specs: 'Lab scale flow reactor',
      difficulty: 'advanced',
      package: 'vapourtec',
      path: 'vapourtec.sf10',
      module: 'SF10'
    },
    {
      id: 'tecan-pump',
      name: 'Tecan Syringe Pump',
      category: 'Liquid Handling',
      vendor: 'Tecan',
      connection: ['usb'],
      icon: '💧',
      specs: 'Cavro XLP6000, RS232',
      difficulty: 'intermediate',
      package: 'north-devices',
      path: 'north_devices.pumps.tecan_cavro',
      module: 'TecanCavro'
    },
    {
      id: 'heinsight',
      name: 'HeinSight',
      category: 'Process Monitoring',
      vendor: 'Hein Lab',
      connection: ['network'],
      icon: '📹',
      specs: 'Camera system, REST API',
      difficulty: 'intermediate',
      package: 'heinsight',
      path: 'heinsight.heinsight_api',
      module: 'HeinsightAPI'
    }
  ];

  const optimizerOptions = [
    {
      id: 'ax-platform',
      name: 'Ax Platform',
      description: 'Bayesian optimization framework by Meta',
      source: 'Meta AI',
      icon: '🎯',
      github: 'facebook/Ax',
      package: 'ax-platform',
      compatible: ['all']
    },
    {
      id: 'baybe',
      name: 'BayBE',
      description: 'Bayesian back end for experimental design',
      source: 'Merck KGaA',
      icon: '🧬',
      github: 'emdgroup/baybe',
      package: 'baybe',
      compatible: ['all']
    },
    {
      id: 'nimo',
      name: 'NIMO',
      description: 'Neural multi-objective optimization',
      source: 'NIMS',
      icon: '🧠',
      github: 'NIMS/nimo',
      package: 'nimo',
      compatible: ['all']
    }
  ];

  const templateOptions = [
  ];

  const filteredHardware = hardwareOptions.filter(hw =>
    hw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hw.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hw.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = selectedTemplate ? [selectedTemplate] : templateOptions.filter(template => {
    if (selectedHardware.length === 0) return true;
    const selectedIds = selectedHardware.map(hw => hw.id);
    return template.hardware.some(hwId => selectedIds.includes(hwId));
  });

  const addHardware = (hw) => {
    const instanceId = `${hw.id}-${Date.now()}`;
    setSelectedHardware([...selectedHardware, { ...hw, instanceId }]);
    setConnections({
      ...connections,
      [instanceId]: {
        type: hw.connection[0],
        port: '',
        baudRate: '115200',
        ip: '',
        networkPort: '8080',
        nickname: `${hw.name} #${selectedHardware.filter(h => h.id === hw.id).length + 1}`
      }
    });
  };

  const removeHardware = (instanceId) => {
    setSelectedHardware(selectedHardware.filter(h => h.instanceId !== instanceId));
    const newConnections = { ...connections };
    delete newConnections[instanceId];
    setConnections(newConnections);
  };

  const updateConnection = (instanceId, field, value) => {
    setConnections({
      ...connections,
      [instanceId]: {
        ...connections[instanceId],
        [field]: value
      }
    });
  };

  const generateBashScript = () => {
    const uniquePackages = [...new Set(selectedHardware.map(hw => hw.package))];
    const optimizerPackages = selectedOptimizers.map(id => 
      optimizerOptions.find(o => o.id === id)?.package
    ).filter(Boolean);

    const hardwareImports = selectedHardware.map(hw => {
      const className = hw.name.replace(/\s+/g, '');
      return `from ${hw.path} import ${hw.module}`;
    }).join('\n');

    const hardwareInstances = selectedHardware.map(hw => {
      const varName = connections[hw.instanceId]?.nickname.toLowerCase().replace(/[^a-z0-9]/g, '_');
      // const className = hw.name.replace(/\s+/g, '');
      const conn = connections[hw.instanceId];
      
      if (conn?.type === 'usb') {
        return `${varName} = ${hw.module}("${conn.port}")`;
      } else {
        return `${varName} = ${className}(ip="${conn.ip}", port=${conn.networkPort})`;
      }
    }).join('\n');

    const bashScript = `#!/bin/bash
# IvoryOS Auto-Generated Launch Script
# Generated: ${new Date().toISOString()}

echo "Setting up IvoryOS environment..."

# Install uv if not present
if ! command -v uv &> /dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi

# Create virtual environment
uv venv ivoryos-env
source ivoryos-env/bin/activate

# Install core IvoryOS
uv pip install ivoryos

# Install hardware drivers
${uniquePackages.map(pkg => `uv pip install ${pkg}`).join('\n')}

# Install optimizers
${optimizerPackages.map(pkg => `uv pip install ${pkg}`).join('\n')}

echo "Installation complete! Starting IvoryOS..."

# Run the main script
python main.py
`;

    const mainScript = `#!/usr/bin/env python3
"""
IvoryOS Main Script
Generated: ${new Date().toISOString()}
"""

${hardwareImports}
import ivoryos

# Initialize hardware
${hardwareInstances}

# Start IvoryOS web interface
if __name__ == "__main__":
    ivoryos.run(__name__)
`;

    return { bash: bashScript, python: mainScript };
  };

  const handleDownload = () => {
    if (downloadType === 'bash') {
      const { bash, python } = generateBashScript();
      
      // Download bash script
      const bashBlob = new Blob([bash], { type: 'text/plain' });
      const bashUrl = URL.createObjectURL(bashBlob);
      const bashLink = document.createElement('a');
      bashLink.href = bashUrl;
      bashLink.download = 'ivoryos-setup.sh';
      bashLink.click();
      URL.revokeObjectURL(bashUrl);
      
      // Download Python script
      setTimeout(() => {
        const pyBlob = new Blob([python], { type: 'text/plain' });
        const pyUrl = URL.createObjectURL(pyBlob);
        const pyLink = document.createElement('a');
        pyLink.href = pyUrl;
        pyLink.download = 'main.py';
        pyLink.click();
        URL.revokeObjectURL(pyUrl);
      }, 100);
    }
  };

  const handleCopyMain = () => {
    const { python } = generateBashScript();
    navigator.clipboard.writeText(python);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  const handleDownloadMain = () => {
    const { python } = generateBashScript();
    const pyBlob = new Blob([python], { type: 'text/plain' });
    const pyUrl = URL.createObjectURL(pyBlob);
    const pyLink = document.createElement('a');
    pyLink.href = pyUrl;
    pyLink.download = 'main.py';
    pyLink.click();
    URL.revokeObjectURL(pyUrl);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'text-green-600 bg-green-50',
      intermediate: 'text-yellow-600 bg-yellow-50',
      advanced: 'text-red-600 bg-red-50'
    };
    return colors[difficulty];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IvoryOS Hub</h1>
                <p className="text-sm text-gray-500">No-code laboratory automation</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${step === 'hardware' ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}>
                <Cpu className="w-4 h-4" />
                Hardware
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${step === 'optimizers' ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}>
                <Zap className="w-4 h-4" />
                Optimizers
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${step === 'connect' ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}>
                <Settings className="w-4 h-4" />
                Connect
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${step === 'launch' ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}>
                <Play className="w-4 h-4" />
                Launch
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${step === 'templates' ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}>
                <FileText className="w-4 h-4" />
                Templates
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {step === 'hardware' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Hardware</h2>
              <p className="text-gray-600">Select instruments from your laboratory setup. You can add multiple instances of the same device.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search hardware by name, vendor, or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredHardware.map(hw => (
                    <div
                      key={hw.id}
                      className="p-4 border-2 border-gray-200 bg-white rounded-xl hover:border-blue-300 hover:shadow transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-2xl">{hw.icon}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(hw.difficulty)}`}>
                          {hw.difficulty}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{hw.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{hw.vendor} • {hw.category}</p>
                      <p className="text-xs text-gray-600 mb-3">{hw.specs}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {hw.connection.map(conn => (
                            <div key={conn} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                              {conn === 'usb' && <Usb className="w-3 h-3" />}
                              {conn === 'network' && <Wifi className="w-3 h-3" />}
                              {conn}
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => addHardware(hw)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white border-2 border-blue-200 rounded-xl p-4 sticky top-4">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Selected Hardware ({selectedHardware.length})
                  </h3>
                  {selectedHardware.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No hardware selected yet</p>
                  ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {selectedHardware.map(hw => (
                        <div key={hw.instanceId} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{hw.icon}</span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{connections[hw.instanceId]?.nickname}</p>
                                <p className="text-xs text-gray-500">{hw.vendor}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeHardware(hw.instanceId)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => selectedHardware.length > 0 && setStep('optimizers')}
                    disabled={selectedHardware.length === 0}
                    className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Next: Choose Optimizers
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'optimizers' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Optimization Algorithms</h2>
              <p className="text-gray-600">Select Bayesian optimization frameworks currently supported by IvoryOS</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {optimizerOptions.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSelectedOptimizers(prev =>
                      prev.includes(opt.id)
                        ? prev.filter(id => id !== opt.id)
                        : [...prev, opt.id]
                    );
                  }}
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedOptimizers.includes(opt.id)
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{opt.icon}</div>
                    {selectedOptimizers.includes(opt.id) && (
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{opt.name}</h3>
                  <p className="text-xs text-purple-600 mb-2">{opt.source}</p>
                  <p className="text-sm text-gray-600 mb-3">{opt.description}</p>
                  <div className="text-xs text-gray-500 flex items-center gap-1 pointer-events-none opacity-50">
                    <span>📦</span> {opt.github}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between max-w-4xl mx-auto">
              <button
                onClick={() => setStep('hardware')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep('connect')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                Next: Configure Connections
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 'connect' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Connections</h2>
              <p className="text-gray-600">Set up communication parameters for each instrument</p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {selectedHardware.map((hw) => (
                <div key={hw.instanceId} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <span className="text-2xl">{hw.icon}</span>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={connections[hw.instanceId]?.nickname || ''}
                        onChange={(e) => updateConnection(hw.instanceId, 'nickname', e.target.value)}
                        className="font-bold text-gray-900 text-lg border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none w-full"
                      />
                      <p className="text-sm text-gray-500">{hw.vendor} • {hw.category}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Connection Type</label>
                      <div className="flex gap-3">
                        {hw.connection.map(conn => (
                          <button
                            key={conn}
                            onClick={() => updateConnection(hw.instanceId, 'type', conn)}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                              connections[hw.instanceId]?.type === conn
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 text-gray-600 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {conn === 'usb' && <Usb className="w-4 h-4" />}
                              {conn === 'network' && <Wifi className="w-4 h-4" />}
                              {conn.toUpperCase()}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {connections[hw.instanceId]?.type === 'usb' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Serial Port</label>
                          <input
                            type="text"
                            value={connections[hw.instanceId]?.port || ''}
                            onChange={(e) => updateConnection(hw.instanceId, 'port', e.target.value)}
                            placeholder="/dev/ttyUSB0 or COM3"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Baud Rate</label>
                          <select
                            value={connections[hw.instanceId]?.baudRate || '115200'}
                            onChange={(e) => updateConnection(hw.instanceId, 'baudRate', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option>9600</option>
                            <option>19200</option>
                            <option>38400</option>
                            <option>57600</option>
                            <option>115200</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {connections[hw.instanceId]?.type === 'network' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">IP Address</label>
                          <input
                            type="text"
                            value={connections[hw.instanceId]?.ip || ''}
                            onChange={(e) => updateConnection(hw.instanceId, 'ip', e.target.value)}
                            placeholder="192.168.1.100"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                          <input
                            type="text"
                            value={connections[hw.instanceId]?.networkPort || ''}
                            onChange={(e) => updateConnection(hw.instanceId, 'networkPort', e.target.value)}
                            placeholder="8080"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-4xl mx-auto">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Auto-Detection Available</p>
                  <p>The launcher will scan for connected devices on first run and can pre-fill these values automatically.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between max-w-4xl mx-auto">
              <button
                onClick={() => setStep('optimizers')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep('launch')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                Next: Generate Launcher
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 'launch' && (
          <div>
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Launch!</h2>
              <p className="text-gray-600">Choose your deployment method</p>
            </div>

            <div className="bg-white rounded-xl border p-6 max-w-3xl mx-auto">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Configuration Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedHardware.length} Instrument{selectedHardware.length !== 1 ? 's' : ''} Connected
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedHardware.map(hw => connections[hw.instanceId]?.nickname).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedOptimizers.length} Optimizer{selectedOptimizers.length !== 1 ? 's' : ''} Selected
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedOptimizers.map(id => 
                          optimizerOptions.find(o => o.id === id)?.name
                        ).join(', ') || 'None'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Choose Deployment Method</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setDownloadType('bash')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      downloadType === 'bash'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-gray-900 mb-1">Bash Script</div>
                    <div className="text-xs text-gray-600">Uses uv for fast Python setup</div>
                  </button>
                  <button
                    onClick={() => setDownloadType('exe')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      downloadType === 'exe'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-bold text-gray-900 mb-1">Executable</div>
                    <div className="text-xs text-gray-600">Standalone .exe (~50MB)</div>
                  </button>
                </div>

                {downloadType === 'bash' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-sm text-gray-900 mb-2">Generated Files:</h4>
                      <ul className="text-sm text-gray-700 space-y-1 mb-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><code className="bg-gray-200 px-1 rounded">ivoryos-setup.sh</code> - Installs uv, creates venv, installs packages</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><code className="bg-gray-200 px-1 rounded">main.py</code> - Hardware initialization and IvoryOS launcher</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-bold text-gray-700 mb-2">Packages to install:</div>
                      <div className="p-3 bg-white rounded border text-xs font-mono text-gray-700">
                        <div className="text-green-600"># Core</div>
                        <div>ivoryos</div>
                        <div className="text-green-600 mt-2"># Hardware drivers</div>
                        {[...new Set(selectedHardware.map(hw => hw.package))].map(pkg => (
                          <div key={pkg}>{pkg}</div>
                        ))}
                        {selectedOptimizers.length > 0 && (
                          <>
                            <div className="text-green-600 mt-2"># Optimizers</div>
                            {selectedOptimizers.map(id => (
                              <div key={id}>{optimizerOptions.find(o => o.id === id)?.package}</div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => setShowMainPreview(!showMainPreview)}
                          className="text-sm font-bold text-gray-700 flex items-center gap-2 hover:text-blue-600"
                        >
                          Preview: main.py
                          <span className="text-xs">{showMainPreview ? '▼' : '▶'}</span>
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCopyMain}
                            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
                          >
                            {copiedMain ? <CheckCircle className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                            {copiedMain ? 'Copied!' : 'Copy'}
                          </button>
                          <button
                            onClick={handleDownloadMain}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      </div>
                      {showMainPreview && (
                        <div className="p-4 bg-gray-900 rounded text-xs font-mono text-green-400 overflow-x-auto max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre">{generateBashScript().python}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {downloadType === 'exe' && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-sm text-gray-900 mb-2">What's Included:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Python 3.11 runtime</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">All hardware drivers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Selected optimizers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Web UI server</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Auto-device detection</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Auto-update system</span>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                      <p className="font-medium">Built with PyInstaller</p>
                      <p className="mt-1">Single file using --onefile --windowed mode. No Python installation needed!</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownload}
                disabled={downloadType === 'exe'}
                className={`w-full px-6 py-4 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg ${
                  downloadType === 'exe'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                <Download className="w-5 h-5" />
                {downloadType === 'exe' ? 'Executable Build (Demo Mode)' : 'Download Scripts'}
              </button>

              <p className="text-xs text-center text-gray-500 mt-3">
                {downloadType === 'exe' 
                  ? 'Executable generation would be available in production deployment'
                  : 'Run ./ivoryos-setup.sh to install and launch IvoryOS'
                }
              </p>
            </div>

            <div className="mt-8 flex justify-between max-w-3xl mx-auto">
              <button
                onClick={() => setStep('connect')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep('templates')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                Browse Templates
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 'templates' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Experiment Templates</h2>
              <p className="text-gray-600">
                {selectedHardware.length > 0 
                  ? 'Templates compatible with your selected hardware'
                  : 'Browse all available templates for IvoryOS experiments'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(selectedTemplate?.id === template.id ? null : template)}
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:shadow'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{template.icon}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">Hardware:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.hardware.map(hwId => {
                          const hw = hardwareOptions.find(h => h.id === hwId);
                          return hw ? (
                            <span key={hwId} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                              {hw.icon} {hw.name.split(' ')[0]}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                    {template.optimizers.length > 0 && (
                      <div className="text-xs text-gray-700">
                        <span className="font-medium">Optimizers:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.optimizers.map(optId => {
                            const opt = optimizerOptions.find(o => o.id === optId);
                            return opt ? (
                              <span key={optId} className="bg-purple-100 px-2 py-0.5 rounded text-xs">
                                {opt.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedTemplate && (
              <div className="mt-6 bg-white rounded-xl border-2 border-green-500 p-6 max-w-4xl mx-auto">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedTemplate.name}</h3>
                    <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">{selectedTemplate.code}</pre>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => {
                  setStep('hardware');
                  setSelectedHardware([]);
                  setSelectedOptimizers([]);
                  setConnections({});
                  setSelectedTemplate(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Start New Configuration
              </button>
              {selectedHardware.length > 0 && (
                <button
                  onClick={() => setStep('launch')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Back to Launch
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IvoryOSMarketplace;