import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, StatusBar, Image } from 'react-native';
import { router } from '../../utils/routerShim';
import { useState, useEffect, useRef } from 'react';
import { Camera, ScanFace, Lock, Zap, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    title: 'Share Event Photos',
    description: 'Event ke thousands of photos ek private digital gallery mein share karein.',
    Icon: Camera,
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop'
  },
  {
    title: 'Find Your Photos',
    description: 'Selfie upload karke AI face recognition se apni photos automatically find karein.',
    Icon: ScanFace,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000&auto=format&fit=crop'
  },
  {
    title: 'Secure & Private',
    description: 'User ko sirf wahi photos aur galleries dikhengi jinki usko permission hai.',
    Icon: Lock,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop'
  },
  {
    title: 'Instant Access',
    description: 'QR scan, invite link ya group code se event turant join karein.',
    Icon: Zap,
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1000&auto=format&fit=crop'
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < ONBOARDING_STEPS.length - 1 ? prev + 1 : 0));
    }, 3500); // Auto slide every 3.5 seconds

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/login');
    }
  };

  const handleSkip = () => {
    router.push('/login');
  };

  const step = ONBOARDING_STEPS[currentStep];
  const StepIcon = step.Icon;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ImageBackground 
        source={{ uri: step.image }} 
        style={styles.bgImage}
      >
        <View style={styles.overlay}>
          {/* Top Header */}
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../../assets/images/icon.png')} style={{ width: 32, height: 32, borderRadius: 8, marginRight: 8 }} resizeMode="contain" />
              <Text style={styles.logoText}>VisionGallery</Text>
            </View>
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Card Area */}
          <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
            
            {/* Animated Content Wrapper */}
            <View style={styles.contentCard}>
              <View style={styles.iconBox}>
                <StepIcon color="#fff" size={40} strokeWidth={1.5} />
              </View>
              
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.description}>{step.description}</Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.dotsContainer}>
                {ONBOARDING_STEPS.map((_, index) => (
                  <View 
                    key={index} 
                    style={[styles.dot, currentStep === index && styles.activeDot]} 
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
                <Text style={styles.primaryBtnText}>
                  {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
                </Text>
                <ArrowRight color="#111" size={20} />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  skipBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  skipText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  bottomContainer: {
    paddingHorizontal: 25,
  },
  contentCard: {
    marginBottom: 40,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 25,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  primaryBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
  }
});
