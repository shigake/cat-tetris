import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamepadNav } from '../hooks/useGamepadNav';
import { useI18n } from '../hooks/useI18n';

function Tutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);
  const { t } = useI18n();

  useEffect(() => {

    const hasSeenTutorial = localStorage.getItem('catTetris_tutorialCompleted');
    if (!hasSeenTutorial) {
      setShow(true);
    }
  }, []);

  const steps = [
    {
      title: t('tutorial.step1Title'),
      description: t('tutorial.step1Desc'),
      tips: [
        t('tutorial.step1Tip1'),
        t('tutorial.step1Tip2'),
        t('tutorial.step1Tip3'),
        t('tutorial.step1Tip4')
      ]
    },
    {
      title: t('tutorial.step2Title'),
      description: t('tutorial.step2Desc'),
      tips: [
        t('tutorial.step2Tip1'),
        t('tutorial.step2Tip2'),
        t('tutorial.step2Tip3'),
        t('tutorial.step2Tip4')
      ]
    },
    {
      title: t('tutorial.step3Title'),
      description: t('tutorial.step3Desc'),
      tips: [
        t('tutorial.step3Tip1'),
        t('tutorial.step3Tip2'),
        t('tutorial.step3Tip3'),
        t('tutorial.step3Tip4')
      ]
    },
    {
      title: t('tutorial.step4Title'),
      description: t('tutorial.step4Desc'),
      tips: [
        t('tutorial.step4Tip1'),
        t('tutorial.step4Tip2'),
        t('tutorial.step4Tip3'),
        t('tutorial.step4Tip4')
      ]
    },
    {
      title: t('tutorial.step5Title'),
      description: t('tutorial.step5Desc'),
      tips: [
        t('tutorial.step5Tip1'),
        t('tutorial.step5Tip2'),
        t('tutorial.step5Tip3'),
        t('tutorial.step5Tip4')
      ]
    },
    {
      title: t('tutorial.step6Title'),
      description: t('tutorial.step6Desc'),
      tips: [
        t('tutorial.step6Tip1'),
        t('tutorial.step6Tip2'),
        t('tutorial.step6Tip3'),
        t('tutorial.step6Tip4')
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('catTetris_tutorialCompleted', 'true');
    setShow(false);
    if (onComplete) onComplete();
  };

  if (!show) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  // Items: on non-last step = [Skip, Next] = 2; on last step = [Start] = 1
  const navItemCount = isLastStep ? 1 : 2;

  const handleNavConfirm = useCallback((idx) => {
    if (isLastStep) {
      handleNext();
    } else {
      if (idx === 0) handleSkip();
      else handleNext();
    }
  }, [isLastStep, currentStep]);

  const { selectedIndex: tutSelectedIndex } = useGamepadNav({
    itemCount: navItemCount,
    onConfirm: handleNavConfirm,
    onBack: handleSkip,
    active: show,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    >
      <motion.div
        key={currentStep}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-2xl p-8 max-w-lg w-full border-2 border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
      >

        <div className="flex gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-green-500' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-white mb-3"
        >
          {step.title}
        </motion.h2>

        <motion.p
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          className="text-white/80 text-lg mb-6"
        >
          {step.description}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 rounded-lg p-4 mb-6 space-y-2"
        >
          {step.tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-white/90 flex items-start gap-2"
            >
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{tip}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex gap-3">
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className={`flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-colors ${tutSelectedIndex === 0 ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {t('tutorial.skip')}
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg ${(isLastStep ? tutSelectedIndex === 0 : tutSelectedIndex === 1) ? 'ring-2 ring-yellow-400' : ''}`}
          >
            {isLastStep ? t('tutorial.startPlaying') : t('tutorial.next')}
          </button>
        </div>

        <div className="text-center mt-4 text-white/40 text-sm">
          {t('tutorial.stepIndicator', { n: currentStep + 1, total: steps.length })}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Tutorial;

