'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const easing = [0.16, 1, 0.3, 1] as const;

// Types
type DatasetType = 'xor' | 'circle' | 'spiral' | 'clusters';
type ActivationType = 'relu' | 'sigmoid' | 'tanh';

interface DataPoint {
  x: number;
  y: number;
  label: number; // 1 or -1
}

interface Layer {
  weights: number[][]; // [numNeurons][numInputs]
  biases: number[];    // [numNeurons]
  activations: number[];
  zs: number[];
  dWeights: number[][];
  dBiases: number[];
}

// Simple MLP neural network class
class NeuralNetwork {
  layers: Layer[] = [];
  layerSizes: number[];
  activation: ActivationType;
  learningRate: number;

  constructor(layerSizes: number[], activation: ActivationType = 'tanh', learningRate: number = 0.1) {
    this.layerSizes = layerSizes;
    this.activation = activation;
    this.learningRate = learningRate;
    this.init();
  }

  init() {
    this.layers = [];
    for (let i = 1; i < this.layerSizes.length; i++) {
      const numInputs = this.layerSizes[i - 1];
      const numNeurons = this.layerSizes[i];
      const weights: number[][] = [];
      const dWeights: number[][] = [];
      const biases: number[] = [];
      const dBiases: number[] = [];

      for (let j = 0; j < numNeurons; j++) {
        const neuronWeights: number[] = [];
        const neuronDWeights: number[] = [];
        for (let k = 0; k < numInputs; k++) {
          const scale = this.activation === 'relu' ? Math.sqrt(2.0 / numInputs) : Math.sqrt(1.0 / numInputs);
          neuronWeights.push((Math.random() * 2 - 1) * scale);
          neuronDWeights.push(0);
        }
        weights.push(neuronWeights);
        dWeights.push(neuronDWeights);
        biases.push((Math.random() * 2 - 1) * 0.1);
        dBiases.push(0);
      }

      this.layers.push({
        weights,
        biases,
        activations: new Array(numNeurons).fill(0),
        zs: new Array(numNeurons).fill(0),
        dWeights,
        dBiases,
      });
    }
  }

  activate(x: number): number {
    if (this.activation === 'relu') return Math.max(0, x);
    if (this.activation === 'sigmoid') return 1.0 / (1.0 + Math.exp(-x));
    return Math.tanh(x); // default tanh
  }

  activateDerivative(activatedVal: number): number {
    if (this.activation === 'relu') return activatedVal > 0 ? 1.0 : 0.0;
    if (this.activation === 'sigmoid') return activatedVal * (1.0 - activatedVal);
    return 1.0 - activatedVal * activatedVal; // tanh
  }

  forward(inputs: number[]): number[] {
    let currentActivations = [...inputs];
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const nextActivations: number[] = [];
      for (let j = 0; j < layer.weights.length; j++) {
        let z = layer.biases[j];
        for (let k = 0; k < layer.weights[j].length; k++) {
          z += currentActivations[k] * layer.weights[j][k];
        }
        layer.zs[j] = z;
        const activated = (i === this.layers.length - 1) 
          ? Math.tanh(z) // Tanh on final layer mapping output to [-1, 1]
          : this.activate(z);
        layer.activations[j] = activated;
        nextActivations.push(activated);
      }
      currentActivations = nextActivations;
    }
    return currentActivations;
  }

  backward(inputs: number[], target: number) {
    this.forward(inputs);

    const outputLayer = this.layers[this.layers.length - 1];
    const output = outputLayer.activations[0];
    const delta = (output - target) * (1.0 - output * output); // derivative of tanh for final output

    const deltas: number[][] = [];
    deltas.push([delta]);

    // Backpropagate errors
    for (let i = this.layers.length - 2; i >= 0; i--) {
      const currentLayer = this.layers[i];
      const nextLayer = this.layers[i + 1];
      const currentDeltas: number[] = [];

      for (let j = 0; j < currentLayer.weights.length; j++) {
        let error = 0;
        for (let k = 0; k < nextLayer.weights.length; k++) {
          error += nextLayer.weights[k][j] * deltas[0][k];
        }
        const deltaJ = error * this.activateDerivative(currentLayer.activations[j]);
        currentDeltas.push(deltaJ);
      }
      deltas.unshift(currentDeltas);
    }

    // Accumulate gradients
    let prevActivations = [...inputs];
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const layerDeltas = deltas[i];
      for (let j = 0; j < layer.weights.length; j++) {
        layer.dBiases[j] += layerDeltas[j];
        for (let k = 0; k < layer.weights[j].length; k++) {
          layer.dWeights[j][k] += layerDeltas[j] * prevActivations[k];
        }
      }
      prevActivations = [...layer.activations];
    }
  }

  updateWeights(batchSize: number) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      for (let j = 0; j < layer.weights.length; j++) {
        layer.biases[j] -= this.learningRate * (layer.dBiases[j] / batchSize);
        layer.dBiases[j] = 0; // reset
        for (let k = 0; k < layer.weights[j].length; k++) {
          layer.weights[j][k] -= this.learningRate * (layer.dWeights[j][k] / batchSize);
          layer.dWeights[j][k] = 0; // reset
        }
      }
    }
  }
}

// Generators
const generateData = (type: DatasetType, count = 150): DataPoint[] => {
  const points: DataPoint[] = [];
  const noise = 0.12;

  if (type === 'xor') {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const label = (x * y >= 0) ? 1 : -1;
      points.push({
        x: x + (Math.random() * 2 - 1) * noise,
        y: y + (Math.random() * 2 - 1) * noise,
        label,
      });
    }
  } else if (type === 'circle') {
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const theta = Math.random() * Math.PI * 2;
      const label = r < 0.55 ? 1 : -1;
      // Add gap noise
      const x = Math.cos(theta) * (r * 1.1);
      const y = Math.sin(theta) * (r * 1.1);
      points.push({ x, y, label });
    }
  } else if (type === 'clusters') {
    for (let i = 0; i < count; i++) {
      const label = Math.random() > 0.5 ? 1 : -1;
      const cx = label === 1 ? -0.4 : 0.4;
      const cy = label === 1 ? -0.4 : 0.4;
      points.push({
        x: cx + (Math.random() * 2 - 1) * 0.28 + (Math.random() * 2 - 1) * noise,
        y: cy + (Math.random() * 2 - 1) * 0.28 + (Math.random() * 2 - 1) * noise,
        label,
      });
    }
  } else if (type === 'spiral') {
    // Spiral generator
    for (let i = 0; i < count; i++) {
      const label = i < count / 2 ? 1 : -1;
      const theta = (i / (count / 2)) * Math.PI * 2.8;
      const r = (theta / (Math.PI * 2.8)) * 0.9;
      const noiseX = (Math.random() * 2 - 1) * 0.05;
      const noiseY = (Math.random() * 2 - 1) * 0.05;

      if (label === 1) {
        points.push({
          x: Math.cos(theta) * r + noiseX,
          y: Math.sin(theta) * r + noiseY,
          label,
        });
      } else {
        points.push({
          x: Math.cos(theta + Math.PI) * r + noiseX,
          y: Math.sin(theta + Math.PI) * r + noiseY,
          label,
        });
      }
    }
  }
  return points;
};

export default function NeuralNetworkSimulator() {
  const [datasetType, setDatasetType] = useState<DatasetType>('xor');
  const [activation, setActivation] = useState<ActivationType>('tanh');
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [hiddenLayers, setHiddenLayers] = useState<number[]>([4, 3]); // Neurons per hidden layer
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [iteration, setIteration] = useState<number>(0);
  const [loss, setLoss] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nnRef = useRef<NeuralNetwork | null>(null);
  const dataRef = useRef<DataPoint[]>([]);
  const requestRef = useRef<number | null>(null);

  // Initialize data and network
  useEffect(() => {
    dataRef.current = generateData(datasetType);
    nnRef.current = new NeuralNetwork([2, ...hiddenLayers, 1], activation, learningRate);
    setIteration(0);
    setLoss(0.5); // Default high initial loss
    draw();
  }, [datasetType, hiddenLayers, activation, learningRate]);

  // Compute Loss (Mean Squared Error)
  const computeLoss = useCallback(() => {
    if (!nnRef.current) return 0;
    let sumErr = 0;
    const nn = nnRef.current;
    const data = dataRef.current;
    for (let p of data) {
      const pred = nn.forward([p.x, p.y])[0];
      sumErr += Math.pow(pred - p.label, 2);
    }
    return sumErr / (2 * data.length);
  }, []);

  // Neural network weight drawing variables (for visual sync)
  const [weightsVersion, setWeightsVersion] = useState<number>(0);

  // Training loop step
  const trainStep = useCallback(() => {
    if (!nnRef.current) return;
    const nn = nnRef.current;
    const data = dataRef.current;

    // Mini batch step (using batches of size 12)
    const batchSize = 12;
    for (let k = 0; k < 5; k++) { // Perform multiple steps per animation frame for speed
      for (let i = 0; i < batchSize; i++) {
        const p = data[Math.floor(Math.random() * data.length)];
        nn.backward([p.x, p.y], p.label);
      }
      nn.updateWeights(batchSize);
    }

    setIteration((prev) => prev + 5);
    const currentLoss = computeLoss();
    setLoss(currentLoss);
    setWeightsVersion((v) => v + 1);

    draw();

    if (isRunning) {
      requestRef.current = requestAnimationFrame(trainStep);
    }
  }, [isRunning, computeLoss]);

  // Start / Pause training
  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(trainStep);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, trainStep]);

  // Redraw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nnRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const nn = nnRef.current;
    const data = dataRef.current;

    // Clear and draw grid of predictions
    const gridRes = 50;
    const stepX = 2.0 / gridRes;
    const stepY = 2.0 / gridRes;

    const imgData = ctx.createImageData(width, height);
    const buf = new Uint32Array(imgData.data.buffer);

    for (let py = 0; py < height; py++) {
      const y = 1.0 - (py / height) * 2.0; // scale to [-1, 1]
      for (let px = 0; px < width; px++) {
        const x = (px / width) * 2.0 - 1.0; // scale to [-1, 1]

        const pred = nn.forward([x, y])[0]; // tanh mapped output [-1, 1]

        // Color based on prediction: blue for positive (label 1), orange for negative (label -1)
        // Lerp color components between orange (249, 115, 22) and blue (99, 102, 241)
        const t = (pred + 1.0) / 2.0; // scale output to [0, 1]
        
        const r = Math.round(249 * (1 - t) + 79 * t);
        const g = Math.round(115 * (1 - t) + 70 * t);
        const b = Math.round(22 * (1 - t) + 229 * t);
        
        const idx = py * width + px;
        buf[idx] = (200 << 24) | (b << 16) | (g << 8) | r; // ABGR format
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw Scatter points
    data.forEach((p) => {
      // Coordinate conversions
      const px = ((p.x + 1.0) / 2.0) * width;
      const py = ((1.0 - p.y) / 2.0) * height;

      // Draw point boundary
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
      ctx.strokeStyle = p.label === 1 ? '#4f46e5' : '#ea580c';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Inner color circle
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.label === 1 ? '#818cf8' : '#fb923c';
      ctx.fill();
    });
  }, []);

  const handleReset = () => {
    setIsRunning(false);
    nnRef.current = new NeuralNetwork([2, ...hiddenLayers, 1], activation, learningRate);
    setIteration(0);
    setLoss(0.5);
    setTimeout(draw, 50);
  };

  // Node sizes & positioning coordinates for SVG visualization
  const getSVGCoordinates = () => {
    const totalLayers = hiddenLayers.length + 2;
    const sizes = [2, ...hiddenLayers, 1];
    const width = 360;
    const height = 240;
    const layerSpacing = width / (totalLayers - 1);
    
    const layerNodes = sizes.map((size, layerIdx) => {
      const x = layerIdx * layerSpacing;
      const startY = (height - (size - 1) * 35) / 2;
      return Array.from({ length: size }, (_, nodeIdx) => ({
        x,
        y: startY + nodeIdx * 35,
      }));
    });

    return layerNodes;
  };

  const svgNodes = getSVGCoordinates();

  return (
    <section className="relative py-20 md:py-28 overflow-hidden" id="nn-simulator">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            className="text-xs tracking-[0.2em] uppercase text-indigo-400/80 font-bold mb-3"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easing }}
          >
            AI/ML Experiment
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easing, delay: 0.1 }}
          >
            Interactive Neural Network Lab
          </motion.h2>
          <motion.p
            className="text-sm text-white/50 leading-relaxed font-light"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easing, delay: 0.2 }}
          >
            Train a Multi-Layer Perceptron (MLP) neural network directly in your browser. Real-time backpropagation visually mapping boundaries and weight strengths.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Panel */}
          <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col justify-between backdrop-blur-md">
            <div>
              {/* Dataset selection */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-white/40 tracking-wider uppercase block mb-3">
                  1. Choose Dataset
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['xor', 'circle', 'spiral', 'clusters'] as DatasetType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setDatasetType(type)}
                      className={`px-3 py-2 text-xs rounded-xl font-medium border capitalize transition-all duration-300 ${
                        datasetType === type
                          ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400'
                          : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:bg-white/[0.06] hover:text-white/80'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activation selection */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-white/40 tracking-wider uppercase block mb-3">
                  2. Activation Function
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['tanh', 'sigmoid', 'relu'] as ActivationType[]).map((act) => (
                    <button
                      key={act}
                      onClick={() => setActivation(act)}
                      className={`px-2 py-1.5 text-xs rounded-xl font-medium border uppercase transition-all duration-300 ${
                        activation === act
                          ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400'
                          : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:bg-white/[0.06] hover:text-white/80'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hyperparameters / Learning Rate */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-semibold text-white/40 tracking-wider uppercase mb-2">
                  <span>3. Learning Rate</span>
                  <span className="text-indigo-400 font-mono">{learningRate}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.3"
                  step="0.01"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Architecture Customizer */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-white/40 tracking-wider uppercase block mb-3">
                  4. Hidden Layers
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (hiddenLayers.length > 1) {
                        setHiddenLayers(hiddenLayers.slice(0, -1));
                      }
                    }}
                    disabled={hiddenLayers.length <= 1}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    -
                  </button>
                  <span className="text-xs font-semibold text-white font-mono flex-1 text-center">
                    {hiddenLayers.length} Layers ({hiddenLayers.join('-')})
                  </span>
                  <button
                    onClick={() => {
                      if (hiddenLayers.length < 3) {
                        setHiddenLayers([...hiddenLayers, 4]);
                      }
                    }}
                    disabled={hiddenLayers.length >= 3}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>

                {/* Adjust sizes */}
                <div className="flex gap-2 mt-3">
                  {hiddenLayers.map((size, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <span className="text-[10px] text-white/30 uppercase mb-1">L{idx + 1} Size</span>
                      <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg p-1 w-full justify-between">
                        <button
                          onClick={() => {
                            const next = [...hiddenLayers];
                            if (next[idx] > 1) next[idx]--;
                            setHiddenLayers(next);
                          }}
                          className="w-5 h-5 rounded bg-white/[0.04] text-[10px] text-white/60 hover:bg-white/[0.08]"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-bold font-mono text-white">{size}</span>
                        <button
                          onClick={() => {
                            const next = [...hiddenLayers];
                            if (next[idx] < 8) next[idx]++;
                            setHiddenLayers(next);
                          }}
                          className="w-5 h-5 rounded bg-white/[0.04] text-[10px] text-white/60 hover:bg-white/[0.08]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Run controls */}
            <div className="pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs font-mono mb-4 text-white/50">
                <div>Loss: <span className="text-white font-semibold font-mono">{loss.toFixed(4)}</span></div>
                <div>Epochs: <span className="text-white font-semibold font-mono">{iteration}</span></div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 active:scale-95 ${
                    isRunning
                      ? 'bg-amber-600/10 border border-amber-500/40 text-amber-400 hover:bg-amber-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                  }`}
                >
                  {isRunning ? 'Pause' : 'Train Model'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs font-semibold text-white/80 hover:bg-white/[0.06] active:scale-95 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* SVG Architecture panel */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md min-h-[300px]">
            <span className="absolute top-4 left-4 text-[10px] tracking-widest uppercase text-white/30 font-semibold font-mono z-10">
              Live Network Graph
            </span>
            <div className="w-full flex justify-center items-center">
              <svg width="360" height="240" viewBox="0 0 360 240" className="overflow-visible select-none">
                {/* SVG Weights/Connections */}
                {nnRef.current?.layers.map((layer, layerIdx) => {
                  const fromNodes = svgNodes[layerIdx];
                  const toNodes = svgNodes[layerIdx + 1];

                  return toNodes.map((toNode, toIdx) => {
                    return fromNodes.map((fromNode, fromIdx) => {
                      const weightVal = layer.weights[toIdx]?.[fromIdx] || 0;
                      const opacity = Math.min(0.9, Math.max(0.08, Math.abs(weightVal) * 0.45));
                      const strokeColor = weightVal >= 0 ? '#818cf8' : '#fb923c';
                      const strokeWidth = Math.min(4, Math.max(0.6, Math.abs(weightVal) * 1.5));

                      return (
                        <g key={`${layerIdx}-${toIdx}-${fromIdx}`}>
                          {/* Connection line */}
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeOpacity={opacity}
                          />
                          {/* Streaming active weights energy particles if running */}
                          {isRunning && (
                            <line
                              x1={fromNode.x}
                              y1={fromNode.y}
                              x2={toNode.x}
                              y2={toNode.y}
                              stroke={strokeColor}
                              strokeWidth={strokeWidth * 1.5}
                              strokeOpacity={opacity * 0.9}
                              strokeDasharray="6 30"
                              className="animate-[dash_1.5s_linear_infinite]"
                              style={{
                                animationName: 'dash',
                                strokeDashoffset: weightVal >= 0 ? 100 : -100,
                              }}
                            />
                          )}
                        </g>
                      );
                    });
                  });
                })}

                {/* SVG Nodes */}
                {svgNodes.map((layer, layerIdx) => {
                  const isInput = layerIdx === 0;
                  const isOutput = layerIdx === svgNodes.length - 1;

                  return layer.map((node, nodeIdx) => {
                    let nodeFill = 'rgba(20, 20, 20, 0.9)';
                    let nodeBorder = 'rgba(255, 255, 255, 0.2)';

                    if (isInput) {
                      nodeBorder = 'rgba(129, 140, 248, 0.5)';
                    } else if (isOutput) {
                      // Color output node by final output value
                      const val = nnRef.current?.layers[nnRef.current.layers.length - 1].activations[0] || 0;
                      nodeFill = val >= 0 ? 'rgba(79, 70, 229, 0.15)' : 'rgba(234, 88, 12, 0.15)';
                      nodeBorder = val >= 0 ? '#818cf8' : '#fb923c';
                    } else {
                      // Hidden layer activations
                      const act = nnRef.current?.layers[layerIdx - 1]?.activations[nodeIdx] || 0;
                      nodeFill = act > 0 ? 'rgba(129, 140, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)';
                      nodeBorder = 'rgba(255, 255, 255, 0.12)';
                    }

                    return (
                      <g key={`${layerIdx}-${nodeIdx}`}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={12}
                          fill={nodeFill}
                          stroke={nodeBorder}
                          strokeWidth="2"
                          className="transition-colors duration-200"
                        />
                        <text
                          x={node.x}
                          y={node.y}
                          dy=".3em"
                          fontSize="7.5px"
                          fontWeight="bold"
                          fill="rgba(255, 255, 255, 0.6)"
                          textAnchor="middle"
                          className="pointer-events-none font-mono"
                        >
                          {isInput ? `X${nodeIdx + 1}` : isOutput ? 'Y' : `H${layerIdx}`}
                        </text>
                      </g>
                    );
                  });
                })}
              </svg>
            </div>
            {/* Marching keyframes definition injected */}
            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: 0;
                }
              }
            `}</style>
          </div>

          {/* Decision Boundary Grid */}
          <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md">
            <span className="absolute top-4 left-4 text-[10px] tracking-widest uppercase text-white/30 font-semibold font-mono z-10">
              Decision Boundary
            </span>

            <div className="relative mt-4 flex items-center justify-center w-full max-w-[210px] aspect-square rounded-xl overflow-hidden border border-white/[0.06] shadow-2xl">
              <canvas
                ref={canvasRef}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full flex justify-between mt-4 text-[10px] text-white/30 font-mono tracking-widest">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-indigo-400" />
                <span>CLASS +1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-orange-400" />
                <span>CLASS -1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
