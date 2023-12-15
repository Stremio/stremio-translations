group = "com.github.Stremio"
version = "1.44.4"

plugins {
    kotlin("multiplatform")
    id("maven-publish")
    id("com.android.library")
}

repositories {
    google()
    mavenCentral()
}

val lyricistVersion = "1.4.1"

kotlin {
    android {
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
    defaultConfig {
        minSdk = 22
        compileSdk = 33
    }

    sourceSets {
        getByName("main") {
            manifest.srcFile("src/androidMain/AndroidManifest.xml")
        }
    }
}
