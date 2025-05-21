group = "com.github.Stremio"
version = "1.44.11"

plugins {
    kotlin("multiplatform")
    id("maven-publish")
    id("com.android.library")
}

repositories {
    google()
    mavenCentral()
}

val lyricistVersion = "1.7.0"

kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }

    @Suppress("UNUSED_VARIABLE")
    sourceSets {
        val commonMain by getting {
            dependencies {
                api("cafe.adriel.lyricist:lyricist:${lyricistVersion}")
            }
        }
        val androidMain by getting
    }
}

android {
    namespace = "com.stremio.translations"
    sourceSets["main"].manifest.srcFile("src/androidMain/AndroidManifest.xml")
    defaultConfig {
        minSdk = 22
        compileSdk = 34
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
